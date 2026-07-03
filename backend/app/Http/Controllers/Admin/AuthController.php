<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\IssuesAdminToken;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use IssuesAdminToken;

    public function login(LoginRequest $request): JsonResponse
    {
        $user = \App\Models\User::query()
            ->where('email', $request->validated('email'))
            ->where('is_active', true)
            ->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau kata sandi salah.'],
            ]);
        }

        if (! $user->isPanelUser()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return $this->issueAuthResponse($user);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'teacher_id' => $user->teacher_id,
            ],
        ]);
    }
}
