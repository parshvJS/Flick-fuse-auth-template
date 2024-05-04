
export async function checkRequestMethod(request:Request,method:string){
    if(request.method !== method){
        return Response.json({
            success:false,
            message:`only accepting ${method} Method Here !`
        })
    }
}