import Head from "next/head";


/**
 * 
 * Componente de SEO responsável por definir dinamicamente as tags de título e descrição da página.
 * Também define metatags para compartilhamento em redes sociais (Open Graph).
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.titulo - Título da página, usado em <title> e meta tags.
 * @param {string} props.descricao - Descrição da página, usada em meta tags de descrição.
 * 
 */
export default function SEO({titulo, descricao}){
    return(
        <Head>
            <title>{titulo}</title>
            <meta property="og:title" content={titulo} />
            <meta property="og:description" content={descricao} />
            <meta name="description" content={descricao} />
            <meta property="og:type" content="website" />
        </Head>
    )
}
