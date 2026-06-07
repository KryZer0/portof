<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\redirectController;

Route::get('/', function () {
    return view('portofolio');
});

Route::get('/{id}',[RedirectController::class, 'redirect']);