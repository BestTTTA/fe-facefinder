import Carousel from "@/components/Carousel";
import Search from "@/components/Search";
import ShowEvent from "@/components/ShowEvent";

export default function Home() {
  return (
    <main className="flex w-full justify-center">
      <div className="flex flex-col items-center w-container gap-8">
        <Carousel />
        <Search />
        <ShowEvent />
      </div>
    </main>
  );
}
