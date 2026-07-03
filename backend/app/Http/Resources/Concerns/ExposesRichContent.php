<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Http\Request;

trait ExposesRichContent
{
    protected function isAdminRequest(Request $request): bool
    {
        return $request->routeIs('admin.*') || str_contains($request->path(), '/admin/');
    }

    protected function exposesFullContent(Request $request): bool
    {
        return $request->routeIs('admin.*')
            || $request->routeIs('v1.news.showBySlug')
            || $request->routeIs('v1.news.showByUuid')
            || $request->routeIs('v1.student-activities.showBySlug')
            || $request->routeIs('v1.student-activities.showByUuid')
            || $request->routeIs('v1.facilities.showBySlug')
            || $request->routeIs('v1.teachers.showBySlug')
            || $request->routeIs('v1.teachers.showByUuid');
    }
}
