<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\V1\ProfileResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user()->load('teacher');

        return response()->json([
            'data' => new ProfileResource($user),
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user()->load('teacher');
        $validated = $request->validated();

        if (isset($validated['user'])) {
            $userData = $validated['user'];

            if (isset($userData['password'])) {
                if (empty($userData['password'])) {
                    unset($userData['password']);
                } else {
                    $userData['password'] = Hash::make($userData['password']);
                }
            }

            $user->update($userData);
        }

        if (isset($validated['teacher']) && $user->teacher) {
            $user->teacher->update($validated['teacher']);
        }

        $user->refresh()->load('teacher');

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'data' => new ProfileResource($user),
        ]);
    }
}
