import Head from "next/head";


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
