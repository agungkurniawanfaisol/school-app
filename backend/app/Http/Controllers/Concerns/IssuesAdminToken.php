<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use Illuminate\Http\JsonResponse;

trait IssuesAdminToken
{
    protected function issueAuthResponse(User $user, string $message = 'Login berhasil.'): JsonResponse
    {
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => $message,
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'teacher_id' => $user->teacher_id,
                ],
            ],
        ]);
    }
}
