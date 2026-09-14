import GeoClient from "@/app/[locale]/(context)/(client)/geo/GeoClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'geo'});
}

export default async function GeoPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="geo"/>
            <GeoClient/>
        </>
    );
}
