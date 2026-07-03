<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\V1\UserResource;
use App\Models\School;
use App\Models\Teacher;
use App\Models\User;
use App\Repositories\BaseRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    use HandlesCrud;

    public function __construct(private UserRepository $userRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->userRepository;
    }

    protected function resourceClass(): string
    {
        return UserResource::class;
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['is_active'] = $data['is_active'] ?? true;

        if ($data['role'] === User::ROLE_GURU) {
            $data['teacher_id'] = $this->resolveTeacherId($data['teacher_id'] ?? null, $data['name']);
        } else {
            $data['teacher_id'] = null;
        }

        $user = $this->userRepository->create($data);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function update(UpdateUserRequest $request, int $user): JsonResponse
    {
        $model = $this->userRepository->find($user);

        if (! $model instanceof User) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $data = $request->validated();

        if (array_key_exists('password', $data)) {
            if (empty($data['password'])) {
                unset($data['password']);
            } else {
                $data['password'] = Hash::make($data['password']);
            }
        }

        if (($data['role'] ?? $model->role) === User::ROLE_GURU) {
            if (array_key_exists('teacher_id', $data)) {
                $data['teacher_id'] = $this->resolveTeacherId($data['teacher_id'], $data['name'] ?? $model->name, $model->teacher_id);
            }
        } elseif (array_key_exists('role', $data) && $data['role'] === User::ROLE_ADMIN) {
            $data['teacher_id'] = null;
        }

        if ($model->id === $request->user()?->id && isset($data['role']) && $data['role'] !== User::ROLE_ADMIN) {
            return response()->json(['message' => 'Anda tidak dapat mengubah role akun sendiri.'], 422);
        }

        if ($model->id === $request->user()?->id && isset($data['is_active']) && ! $data['is_active']) {
            return response()->json(['message' => 'Anda tidak dapat menonaktifkan akun sendiri.'], 422);
        }

        $model = $this->userRepository->update($model, $data);

        return response()->json([
            'message' => 'Pengguna berhasil diperbarui.',
            'data' => new UserResource($model),
        ]);
    }

    public function destroy(Request $request, int $user): JsonResponse
    {
        $model = $this->userRepository->find($user);

        if (! $model instanceof User) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        if ($model->id === $request->user()?->id) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun sendiri.'], 422);
        }

        if ($model->isAdmin() && User::query()->where('role', User::ROLE_ADMIN)->where('is_active', true)->count() <= 1) {
            return response()->json(['message' => 'Tidak dapat menghapus admin terakhir yang aktif.'], 422);
        }

        $this->userRepository->delete($model);

        return response()->json(['message' => 'Pengguna berhasil dihapus.']);
    }

    private function resolveTeacherId(?int $teacherId, string $name, ?int $currentTeacherId = null): ?int
    {
        if ($teacherId) {
            return $teacherId;
        }

        if ($currentTeacherId) {
            return $currentTeacherId;
        }

        $school = School::query()->first();

        if (! $school) {
            return null;
        }

        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Teacher::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        $teacher = Teacher::query()->create([
            'school_id' => $school->id,
            'name' => $name,
            'slug' => $slug,
            'is_active' => true,
        ]);

        return $teacher->id;
    }
}
