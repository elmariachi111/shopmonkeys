<?php

namespace App;

use MongoDB\Client;

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
        $handle = fopen("/var/openfaas/secrets/mongo-connection", "r");
        $mongoUrl = fread($handle, filesize("/var/openfaas/secrets/mongo-connection"));

        $client = new Client($mongoUrl);
        $col = $client->monkeys->products;

        $doc = $col->find([])->toArray();

        return json_encode($doc);
    }
}
