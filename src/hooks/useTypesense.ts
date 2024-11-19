import Typesense from 'typesense';

const client = new Typesense.Client({
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY as string,
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST as string,
        port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL as string,
      },
    ],
});

export default client;