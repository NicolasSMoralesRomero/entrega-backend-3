export class CustomErrors{
    static createError(nombre, causa, mensaje, codigo){
        // throw new Error("usuario inválido...")
        let error=new Error(mensaje, {cause: causa})
        error.code=codigo
        error.custom=true
        error.name=nombre

        throw error
    }
}