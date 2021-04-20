export class APIRoutes {

    static API_URL = process.env.NEXT_PUBLIC_VERCEL_URL.startsWith("http") ?  process.env.NEXT_PUBLIC_VERCEL_URL : "https://"+ process.env.NEXT_PUBLIC_VERCEL_URL;

    static DOCENTES:string = APIRoutes.API_URL + "/api/docente"

}