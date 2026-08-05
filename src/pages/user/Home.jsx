import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Hero from "../../components/home/Hero";
import Testimonials from "../../components/home/Testimonials";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Newsletter from "../../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
       <Newsletter />
    </>
  );
}
