import Carousel from "@/components/Carousel";
import Search from "@/components/Search";
import ShowEvent from "@/components/ShowEvent";
import AlertBar from "@/components/AlertBar";
export default function Home() {
  return (
    <>
      <AlertBar />
      <main className="flex w-full justify-center">
        <div className="flex flex-col items-center w-container gap-8">
          <Carousel />
          <Search />
          <ShowEvent />
        </div>
      </main>
    </>
  );
}
