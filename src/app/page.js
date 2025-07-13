import Carousel from "@/components/Carousel";
import Search from "@/components/Search";
import ShowEvent from "@/components/ShowEvent";
import AlertBar from "@/components/AlertBar";

export default function Home() {
  return (
    <div className="flex flex-col gap-9 bg-surface">

      <AlertBar />
      <main className="flex flex-col items-center max-w-full gap-8 ">
        {/* <Carousel /> */}
        {/* <Search /> */}
        <ShowEvent />
      </main>
    </div>
  );
}
