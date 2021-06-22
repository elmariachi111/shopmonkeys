<?php

namespace App;

use Ramsey\Uuid\Uuid;

/**
 * Class Handler
 * @package App
 */
class Handler
{
    /**
     * @param $data
     * @return
     */
    public function handle($data)
    {
        $uuid = Uuid::uuid4();
        return "hallo woelt from php " . $uuid->toString();
    }
}
