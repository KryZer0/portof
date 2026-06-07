<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class redirectController extends Controller
{
    //
    public function redirect($id)
    {
        if ($id == 4) {
            return redirect()->away('https://forms.gle/cGPjp447KCEtmVEv6');
        } else if ($id == 5) {
            return redirect()->away('https://forms.gle/3aHDkQ9RCXLpLkft5');
        } else {
            return redirect('/');
        }
    }

}
