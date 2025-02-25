export const errorHandler=(error, req, res, next)=>{
    if(error.code){
        // custom error
        console.log(`${error.name}: \nDetalle: ${error.cause}`)
        res.setHeader('Content-Type','application/json');
        return res.status(error.code).json({error:`Internal server error (custom)`, message:process.env.debug?error.message:undefined})
    }else{
        // error genérico... 
        console.log(`Error handler activado: ${error.message}`)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Internal server error (genérico)`})
    }
}