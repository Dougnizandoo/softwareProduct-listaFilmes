/**
 * Recupera o objeto de usuário armazenado no localStorage.
 * @returns {Object|null} O objeto do usuário se estiver presente e for válido, ou `null` se não existir ou ocorrer erro ao ler.
 */
export function get_usuario(){
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        return usuario || null;
    } catch (err) {
        console.error("Erro ao ler usuário do localStorage:", err);
        return null;
    }
}
