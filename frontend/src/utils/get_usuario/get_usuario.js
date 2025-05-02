export function get_usuario(){
    try{
        const busca = JSON.parse(localStorage.getItem("usuario"));
        if (!busca){
            return null;
        } else {
            return busca;
        }
    } catch (err){
        console.log(err);
        return null;
    }
}
