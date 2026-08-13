import WatchPage from "@/modules/watch/views/watch-main-page";

export const dynamic = "force-dynamic";

const Page = async ({ params }) => {
    const { id: slug, type } = await params;
    const id = slug.split("-")[0];

    return (
        <main>
            <WatchPage id={id} type={type} />
        </main>
    );
};

export default Page;