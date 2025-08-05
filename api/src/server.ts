import * as http from 'http';
import { ListenOptions } from 'net';
import { createApp } from './app';

export async function createServer(): Promise<http.Server>{

    const server = http.createServer(await createApp());


    return server;
}

export async function startServer() {
    const server = await createServer();

    let listenOptions: ListenOptions ={
        'port': 3000,
    }

    server.listen(listenOptions, () => {
        console.log(`Server is running on http://localhost:${listenOptions.port}`);
    });
   
}