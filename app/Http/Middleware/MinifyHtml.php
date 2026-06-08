<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MinifyHtml
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        $response = $next($request);

        if (
            str_contains(
                $response->headers->get('Content-Type'),
                'text/html'
            )
        ) {

            $content = $response->getContent();

            $search = [
                '/\>[^\S ]+/s',
                '/[^\S ]+\</s',
                '/(\s)+/s'
            ];

            $replace = [
                '>',
                '<',
                '\\1'
            ];

            $content = preg_replace(
                $search,
                $replace,
                $content
            );

            $response->setContent($content);
        }

        return $response;
    }
}
