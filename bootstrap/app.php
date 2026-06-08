<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Configuration\Routing;
use Illuminate\Foundation\Configuration\Views;
use App\Http\Middleware\MinifyHtml;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
        $middleware->append(
            \App\Http\Middleware\MinifyHtml::class
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
