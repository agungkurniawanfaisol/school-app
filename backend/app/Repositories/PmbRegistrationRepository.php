<?php

namespace App\Repositories;

use App\Models\PmbRegistration;
use App\Models\PmbRegistrationEvent;
use App\Models\PmbRegistrationMessage;
use App\Models\User;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PmbRegistrationRepository extends BaseRepository implements RepositoryInterface
{
    /** @var list<string> */
    private const SORTABLE = [
        'student_name',
        'created_at',
        'status',
        'grade_applied',
        'registration_number',
    ];

    protected function model(): string
    {
        return PmbRegistration::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'uuid', 'school_id', 'user_id', 'registration_number', 'tracking_token',
            'student_name', 'birth_place', 'birth_date', 'gender', 'parent_name', 'parent_phone',
            'parent_email', 'address', 'previous_school', 'grade_applied', 'academic_year', 'status', 'notes',
            'payment_info', 'draft_payload', 'current_step', 'loa_issued_at', 'loa_media_id',
            'notifications_seen_at', 'admin_notifications_seen_at', 'created_at', 'updated_at',
        ];
    }

    protected function defaultWith(): array
    {
        return [
            'documents' => fn ($q) => $q->select(['id', 'pmb_registration_id', 'document_type', 'file_path', 'original_name', 'status', 'created_at']),
            'events' => fn ($q) => $q->select(['id', 'pmb_registration_id', 'actor_user_id', 'type', 'message', 'created_at'])->orderBy('created_at'),
            'messages' => fn ($q) => $q->select(['id', 'pmb_registration_id', 'user_id', 'body', 'media_id', 'read_at', 'admin_read_at', 'created_at'])->orderBy('created_at'),
            'messages.user:id,name,role',
            'events.actor:id,name,role',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['student_name', 'registration_number'];
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        parent::applyFilters($query, $filters);

        if (isset($filters['grade_applied']) && $filters['grade_applied'] !== '') {
            $query->where('grade_applied', $filters['grade_applied']);
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = strtolower((string) ($filters['sort_dir'] ?? 'desc')) === 'asc' ? 'asc' : 'desc';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortDir);

        if ($sortBy !== 'id') {
            $query->orderBy('id', $sortDir);
        }

        $this->addAdminUnreadSelect($query);

        return $query;
    }

    /**
     * Flag rows with unread admin activity (new submit/correction or pendaftar message).
     */
    private function addAdminUnreadSelect(Builder $query): void
    {
        $types = self::ADMIN_NOTIFY_EVENT_TYPES;
        $placeholders = implode(',', array_fill(0, count($types), '?'));

        $query->selectRaw(
            "EXISTS (
                SELECT 1 FROM pmb_registration_events e
                WHERE e.pmb_registration_id = pmb_registrations.id
                  AND e.deleted_at IS NULL
                  AND e.type IN ({$placeholders})
                  AND (
                    pmb_registrations.admin_notifications_seen_at IS NULL
                    OR e.created_at > pmb_registrations.admin_notifications_seen_at
                  )
            ) OR EXISTS (
                SELECT 1 FROM pmb_registration_messages m
                INNER JOIN users u ON u.id = m.user_id AND u.deleted_at IS NULL
                WHERE m.pmb_registration_id = pmb_registrations.id
                  AND m.deleted_at IS NULL
                  AND m.admin_read_at IS NULL
                  AND u.role = ?
            ) as has_admin_unread",
            [...$types, User::ROLE_PENDAFTAR]
        );
    }

    public function findByTrackingToken(string $token): ?Model
    {
        $key = $this->cacheKey('findByTrackingToken', ['token' => $token]);

        return $this->remember($key, function () use ($token) {
            return $this->newQuery()->where('tracking_token', $token)->first();
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     totals: array{all: int, by_status: array<string, int>},
     *     by_grade: list<array{grade: string, count: int}>,
     *     by_gender: list<array{gender: string, count: int}>,
     *     by_month: list<array{year: int, month: int, count: int}>,
     *     top_previous_schools: list<array{name: string, count: int}>
     * }
     */
    public function getStats(array $filters = []): array
    {
        $key = $this->cacheKey('getStats', $filters);

        return $this->remember($key, function () use ($filters) {
            $base = $this->filteredBaseQuery($filters);

            $byStatusRows = (clone $base)
                ->selectRaw('status, COUNT(*) as aggregate')
                ->groupBy('status')
                ->pluck('aggregate', 'status');

            $byStatus = [];
            foreach (PmbRegistration::STATUSES as $status) {
                $byStatus[$status] = (int) ($byStatusRows[$status] ?? 0);
            }

            $byGrade = (clone $base)
                ->selectRaw("COALESCE(NULLIF(grade_applied, ''), '—') as grade, COUNT(*) as aggregate")
                ->groupBy('grade')
                ->orderByDesc('aggregate')
                ->get()
                ->map(fn ($row): array => [
                    'grade' => (string) $row->grade,
                    'count' => (int) $row->aggregate,
                ])
                ->values()
                ->all();

            $byGender = (clone $base)
                ->selectRaw("COALESCE(NULLIF(gender, ''), '—') as gender, COUNT(*) as aggregate")
                ->groupBy('gender')
                ->orderByDesc('aggregate')
                ->get()
                ->map(fn ($row): array => [
                    'gender' => (string) $row->gender,
                    'count' => (int) $row->aggregate,
                ])
                ->values()
                ->all();

            $driver = $base->getConnection()->getDriverName();
            if ($driver === 'sqlite') {
                $yearExpr = "CAST(strftime('%Y', created_at) AS INTEGER)";
                $monthExpr = "CAST(strftime('%m', created_at) AS INTEGER)";
            } else {
                $yearExpr = 'YEAR(created_at)';
                $monthExpr = 'MONTH(created_at)';
            }

            $byMonth = (clone $base)
                ->selectRaw("{$yearExpr} as year, {$monthExpr} as month, COUNT(*) as aggregate")
                ->groupByRaw("{$yearExpr}, {$monthExpr}")
                ->orderByRaw("{$yearExpr} asc, {$monthExpr} asc")
                ->get()
                ->map(fn ($row): array => [
                    'year' => (int) $row->year,
                    'month' => (int) $row->month,
                    'count' => (int) $row->aggregate,
                ])
                ->values()
                ->all();

            $topSchools = (clone $base)
                ->whereNotNull('previous_school')
                ->where('previous_school', '!=', '')
                ->selectRaw('previous_school as name, COUNT(*) as aggregate')
                ->groupBy('previous_school')
                ->orderByDesc('aggregate')
                ->limit(10)
                ->get()
                ->map(fn ($row): array => [
                    'name' => (string) $row->name,
                    'count' => (int) $row->aggregate,
                ])
                ->values()
                ->all();

            return [
                'totals' => [
                    'all' => array_sum($byStatus),
                    'by_status' => $byStatus,
                ],
                'by_grade' => $byGrade,
                'by_gender' => $byGender,
                'by_month' => $byMonth,
                'top_previous_schools' => $topSchools,
            ];
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, PmbRegistration>
     */
    public function getForExport(array $filters = []): Collection
    {
        $max = (int) config('pmb.export_max_rows', 5000);
        $query = $this->filteredBaseQuery($filters);
        $count = (clone $query)->count();

        if ($count > $max) {
            abort(422, "Jumlah data melebihi batas ekspor ({$max} baris).");
        }

        return $this->applyFilters($query, $filters)
            ->select([
                'uuid',
                'registration_number',
                'student_name',
                'academic_year',
                'grade_applied',
                'status',
                'gender',
                'parent_name',
                'parent_phone',
                'parent_email',
                'previous_school',
                'created_at',
                'loa_issued_at',
            ])
            ->limit($max)
            ->get();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function filteredBaseQuery(array $filters): Builder
    {
        $query = PmbRegistration::query();

        // Stats/export should not load heavy relations or order yet.
        $filtersWithoutSort = $filters;
        unset($filtersWithoutSort['sort_by'], $filtersWithoutSort['sort_dir']);

        if (isset($filtersWithoutSort['academic_year'])) {
            $query->where('academic_year', $filtersWithoutSort['academic_year']);
        }
        if (isset($filtersWithoutSort['school_id'])) {
            $query->where('school_id', $filtersWithoutSort['school_id']);
        }
        if (isset($filtersWithoutSort['status'])) {
            $query->where('status', $filtersWithoutSort['status']);
        }
        if (isset($filtersWithoutSort['grade_applied']) && $filtersWithoutSort['grade_applied'] !== '') {
            $query->where('grade_applied', $filtersWithoutSort['grade_applied']);
        }
        if (! empty($filtersWithoutSort['search'])) {
            $search = $filtersWithoutSort['search'];
            $query->where(function (Builder $q) use ($search): void {
                foreach ($this->searchableColumns() as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        return $query;
    }

    /** @var list<string> */
    public const NOTIFY_EVENT_TYPES = [
        'payment_verified',
        'payment_rejected',
        'status_changed',
        'loa_issued',
    ];

    /**
     * Portal notifications derived from admin messages + notify-worthy events.
     *
     * @return array{unread_count: int, items: list<array<string, mixed>>}
     */
    public function getNotificationsForUser(int $userId, int $limit = 30): array
    {
        $registrations = PmbRegistration::query()
            ->select(['id', 'uuid', 'user_id', 'notifications_seen_at', 'status'])
            ->where('user_id', $userId)
            ->get();

        if ($registrations->isEmpty()) {
            return ['unread_count' => 0, 'items' => []];
        }

        $registrationIds = $registrations->pluck('id')->all();
        $seenByReg = $registrations->mapWithKeys(
            fn (PmbRegistration $reg): array => [$reg->id => $reg->notifications_seen_at]
        );
        $uuidById = $registrations->mapWithKeys(
            fn (PmbRegistration $reg): array => [$reg->id => $reg->uuid]
        );

        $adminRoles = [User::ROLE_ADMIN, User::ROLE_ADMIN_PMB];

        $unreadMessagesCount = (int) PmbRegistrationMessage::query()
            ->whereIn('pmb_registration_id', $registrationIds)
            ->whereNull('read_at')
            ->whereHas('user', fn (Builder $q) => $q->whereIn('role', $adminRoles))
            ->count();

        $unreadEventsCount = 0;
        foreach ($registrations as $registration) {
            $eventQuery = PmbRegistrationEvent::query()
                ->where('pmb_registration_id', $registration->id)
                ->whereIn('type', self::NOTIFY_EVENT_TYPES);
            if ($registration->notifications_seen_at !== null) {
                $eventQuery->where('created_at', '>', $registration->notifications_seen_at);
            }
            $unreadEventsCount += (int) $eventQuery->count();
        }

        $messages = PmbRegistrationMessage::query()
            ->select(['id', 'pmb_registration_id', 'user_id', 'body', 'read_at', 'created_at'])
            ->with(['user:id,name,role'])
            ->whereIn('pmb_registration_id', $registrationIds)
            ->whereHas('user', fn (Builder $q) => $q->whereIn('role', $adminRoles))
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $events = PmbRegistrationEvent::query()
            ->select(['id', 'pmb_registration_id', 'actor_user_id', 'type', 'message', 'created_at'])
            ->whereIn('pmb_registration_id', $registrationIds)
            ->whereIn('type', self::NOTIFY_EVENT_TYPES)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $items = [];

        foreach ($messages as $message) {
            $unread = $message->read_at === null;
            $items[] = [
                'id' => 'message-'.$message->id,
                'source' => 'message',
                'source_id' => $message->id,
                'type' => 'message',
                'title' => 'Pesan baru dari admin',
                'body' => Str::limit((string) $message->body, 120),
                'registration_uuid' => $uuidById[$message->pmb_registration_id] ?? null,
                'href_hash' => 'pesan',
                'unread' => $unread,
                'created_at' => $message->created_at?->toIso8601String(),
            ];
        }

        foreach ($events as $event) {
            $seenAt = $seenByReg[$event->pmb_registration_id] ?? null;
            $unread = $seenAt === null || $event->created_at > $seenAt;
            $items[] = [
                'id' => 'event-'.$event->id,
                'source' => 'event',
                'source_id' => $event->id,
                'type' => $event->type,
                'title' => $this->notificationTitleForEvent($event->type, (string) ($event->message ?? '')),
                'body' => Str::limit((string) ($event->message ?? ''), 120),
                'registration_uuid' => $uuidById[$event->pmb_registration_id] ?? null,
                'href_hash' => $event->type === 'loa_issued' ? 'loa' : 'timeline',
                'unread' => $unread,
                'created_at' => $event->created_at?->toIso8601String(),
            ];
        }

        usort($items, static function (array $a, array $b): int {
            return strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? ''));
        });

        $items = array_slice($items, 0, $limit);

        return [
            'unread_count' => $unreadMessagesCount + $unreadEventsCount,
            'items' => array_values($items),
        ];
    }

    /**
     * @param  list<int>  $messageIds
     * @return array{unread_count: int, items: list<array<string, mixed>>}
     */
    public function markNotificationsReadForUser(int $userId, bool $all = false, array $messageIds = []): array
    {
        $registrations = PmbRegistration::query()
            ->where('user_id', $userId)
            ->get();

        if ($registrations->isEmpty()) {
            return ['unread_count' => 0, 'items' => []];
        }

        $now = now();
        $registrationIds = $registrations->pluck('id')->all();
        $adminRoles = [User::ROLE_ADMIN, User::ROLE_ADMIN_PMB];

        if ($all) {
            PmbRegistration::query()
                ->whereIn('id', $registrationIds)
                ->update(['notifications_seen_at' => $now]);

            PmbRegistrationMessage::query()
                ->whereIn('pmb_registration_id', $registrationIds)
                ->whereNull('read_at')
                ->whereHas('user', fn (Builder $q) => $q->whereIn('role', $adminRoles))
                ->update(['read_at' => $now]);
        } elseif ($messageIds !== []) {
            PmbRegistrationMessage::query()
                ->whereIn('id', $messageIds)
                ->whereIn('pmb_registration_id', $registrationIds)
                ->whereNull('read_at')
                ->update(['read_at' => $now]);

            PmbRegistration::query()
                ->whereIn('id', $registrationIds)
                ->update(['notifications_seen_at' => $now]);
        } else {
            PmbRegistration::query()
                ->whereIn('id', $registrationIds)
                ->update(['notifications_seen_at' => $now]);
        }

        return $this->getNotificationsForUser($userId);
    }

    /** @var list<string> */
    public const ADMIN_NOTIFY_EVENT_TYPES = [
        'submitted',
        'correction_submitted',
    ];

    /**
     * Admin notifications: new submissions, corrections, and pendaftar messages.
     *
     * @return array{unread_count: int, items: list<array<string, mixed>>}
     */
    public function getNotificationsForAdmin(int $limit = 30): array
    {
        $registrations = PmbRegistration::query()
            ->select(['id', 'uuid', 'admin_notifications_seen_at', 'student_name', 'registration_number'])
            ->get();

        if ($registrations->isEmpty()) {
            return ['unread_count' => 0, 'items' => []];
        }

        $registrationIds = $registrations->pluck('id')->all();
        $seenByReg = $registrations->mapWithKeys(
            fn (PmbRegistration $reg): array => [$reg->id => $reg->admin_notifications_seen_at]
        );
        $uuidById = $registrations->mapWithKeys(
            fn (PmbRegistration $reg): array => [$reg->id => $reg->uuid]
        );
        $labelById = $registrations->mapWithKeys(
            fn (PmbRegistration $reg): array => [
                $reg->id => trim(($reg->registration_number ?? '').' · '.($reg->student_name ?? 'Pendaftar')),
            ]
        );

        $unreadMessagesCount = (int) PmbRegistrationMessage::query()
            ->whereIn('pmb_registration_id', $registrationIds)
            ->whereNull('admin_read_at')
            ->whereHas('user', fn (Builder $q) => $q->where('role', User::ROLE_PENDAFTAR))
            ->count();

        $unreadEventsCount = 0;
        foreach ($registrations as $registration) {
            $eventQuery = PmbRegistrationEvent::query()
                ->where('pmb_registration_id', $registration->id)
                ->whereIn('type', self::ADMIN_NOTIFY_EVENT_TYPES);
            if ($registration->admin_notifications_seen_at !== null) {
                $eventQuery->where('created_at', '>', $registration->admin_notifications_seen_at);
            }
            $unreadEventsCount += (int) $eventQuery->count();
        }

        $messages = PmbRegistrationMessage::query()
            ->select(['id', 'pmb_registration_id', 'user_id', 'body', 'admin_read_at', 'created_at'])
            ->with(['user:id,name,role'])
            ->whereIn('pmb_registration_id', $registrationIds)
            ->whereHas('user', fn (Builder $q) => $q->where('role', User::ROLE_PENDAFTAR))
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $events = PmbRegistrationEvent::query()
            ->select(['id', 'pmb_registration_id', 'actor_user_id', 'type', 'message', 'created_at'])
            ->whereIn('pmb_registration_id', $registrationIds)
            ->whereIn('type', self::ADMIN_NOTIFY_EVENT_TYPES)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $items = [];

        foreach ($messages as $message) {
            $items[] = [
                'id' => 'message-'.$message->id,
                'source' => 'message',
                'source_id' => $message->id,
                'type' => 'message',
                'title' => 'Pesan baru dari pendaftar',
                'body' => Str::limit(
                    ($labelById[$message->pmb_registration_id] ?? '').': '.(string) $message->body,
                    120
                ),
                'registration_uuid' => $uuidById[$message->pmb_registration_id] ?? null,
                'href_hash' => 'pesan',
                'unread' => $message->admin_read_at === null,
                'created_at' => $message->created_at?->toIso8601String(),
            ];
        }

        foreach ($events as $event) {
            $seenAt = $seenByReg[$event->pmb_registration_id] ?? null;
            $unread = $seenAt === null || $event->created_at > $seenAt;
            $items[] = [
                'id' => 'event-'.$event->id,
                'source' => 'event',
                'source_id' => $event->id,
                'type' => $event->type,
                'title' => $this->adminNotificationTitleForEvent($event->type),
                'body' => Str::limit(
                    ($labelById[$event->pmb_registration_id] ?? '').' — '.(string) ($event->message ?? ''),
                    120
                ),
                'registration_uuid' => $uuidById[$event->pmb_registration_id] ?? null,
                'href_hash' => 'timeline',
                'unread' => $unread,
                'created_at' => $event->created_at?->toIso8601String(),
            ];
        }

        usort($items, static function (array $a, array $b): int {
            return strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? ''));
        });

        $items = array_slice($items, 0, $limit);

        return [
            'unread_count' => $unreadMessagesCount + $unreadEventsCount,
            'items' => array_values($items),
        ];
    }

    /**
     * @param  list<int>  $messageIds
     * @return array{unread_count: int, items: list<array<string, mixed>>}
     */
    public function markAdminNotificationsRead(
        bool $all = false,
        array $messageIds = [],
        ?string $registrationUuid = null,
    ): array {
        $now = now();

        if ($all) {
            PmbRegistration::query()->update(['admin_notifications_seen_at' => $now]);

            PmbRegistrationMessage::query()
                ->whereNull('admin_read_at')
                ->whereHas('user', fn (Builder $q) => $q->where('role', User::ROLE_PENDAFTAR))
                ->update(['admin_read_at' => $now]);

            return $this->getNotificationsForAdmin();
        }

        if ($registrationUuid !== null && $registrationUuid !== '') {
            $registration = PmbRegistration::query()->where('uuid', $registrationUuid)->first();
            if ($registration !== null) {
                $registration->forceFill(['admin_notifications_seen_at' => $now])->save();

                PmbRegistrationMessage::query()
                    ->where('pmb_registration_id', $registration->id)
                    ->whereNull('admin_read_at')
                    ->whereHas('user', fn (Builder $q) => $q->where('role', User::ROLE_PENDAFTAR))
                    ->update(['admin_read_at' => $now]);
            }

            return $this->getNotificationsForAdmin();
        }

        if ($messageIds !== []) {
            $messages = PmbRegistrationMessage::query()
                ->whereIn('id', $messageIds)
                ->whereNull('admin_read_at')
                ->get();

            $registrationIds = $messages->pluck('pmb_registration_id')->unique()->all();

            PmbRegistrationMessage::query()
                ->whereIn('id', $messageIds)
                ->whereNull('admin_read_at')
                ->update(['admin_read_at' => $now]);

            if ($registrationIds !== []) {
                PmbRegistration::query()
                    ->whereIn('id', $registrationIds)
                    ->update(['admin_notifications_seen_at' => $now]);
            }

            return $this->getNotificationsForAdmin();
        }

        return $this->getNotificationsForAdmin();
    }

    private function adminNotificationTitleForEvent(string $type): string
    {
        return match ($type) {
            'submitted' => 'Pendaftaran baru dikirim',
            'correction_submitted' => 'Pendaftar mengirim perbaikan',
            default => 'Update pendaftaran',
        };
    }

    private function notificationTitleForEvent(string $type, string $message): string
    {
        return match ($type) {
            'payment_verified' => 'Pembayaran diverifikasi',
            'payment_rejected' => 'Bukti pembayaran ditolak',
            'loa_issued' => 'LoA telah diterbitkan',
            'status_changed' => $this->titleFromStatusChangedMessage($message),
            default => 'Update pendaftaran',
        };
    }

    private function titleFromStatusChangedMessage(string $message): string
    {
        $lower = mb_strtolower($message);
        if (str_contains($lower, 'diterima') || str_contains($lower, 'accepted')) {
            return 'Status: Diterima';
        }
        if (str_contains($lower, 'ditolak') || str_contains($lower, 'rejected')) {
            return 'Status: Ditolak';
        }
        if (str_contains($lower, 'perbaikan') || str_contains($lower, 'revision')) {
            return 'Perlu perbaikan data';
        }

        return 'Status pendaftaran diperbarui';
    }
}
