export function get_usuario(){
    const busca = JSON.parse(localStorage.getItem("usuario"));
    if (!busca){
        return null;
    } else {
        return busca;
    }
}
