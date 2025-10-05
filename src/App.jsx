import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import pokeEmblem from "./assets/pokemonEmblem.svg";
import "./index.css";
import { useQuery } from "@tanstack/react-query";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import "swiper/css";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const swiperRef = useRef(null);

  // Fetch Pokémon with sprites
  const fetchPokedex = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=386");
    const data = await res.json();

    const pokedexWithSprites = await Promise.all(
      data.results.map(async (p) => {
        const res2 = await fetch(p.url);
        const pokeData = await res2.json();
        return { ...p, sprite: pokeData.sprites.front_default };
      })
    );

    return pokedexWithSprites;
  };

  const {
    data: pokedex = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokedex"],
    queryFn: fetchPokedex,
  });

  const selectPokemon = (index) => {
    setSelectedIndex(index);
    swiperRef.current?.slideTo(index);
  };

  if (isLoading) return <div>Loading Pokedex...</div>;
  if (isError) return <div>Error Fetching Data</div>;

  return (
    <Container fluid className="pokedex-container">
      <Row className="pokedex-row">
        {/* Emblem */}
        <Col xs={12} md={3} className="text-center">
          <h1 className="title">Pokedex</h1>
          <img
            src={pokeEmblem}
            className="pokeEmblem"
            alt="emblem"
            style={{
        transform: `translateY(-50%) rotate(${selectedIndex * 25}deg)`,
      }}
          />
        </Col>

        {/* Pokémon Sprites */}
        <Col  xs={12} md={4} className="pokedex-left mt-5 mx-auto my-auto">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Previous */}
            {pokedex[selectedIndex - 1] && (
              <img
                src={pokedex[selectedIndex - 1].sprite}
                alt="prev"
                style={{
                  position: "absolute",
                  transform: "translateY(-90%) scale(0.8)",
                  opacity: 0.4,
                  width: "80%",
                  maxWidth: "300px",
                  transition: "all 0.3s",
                }}
              />
            )}

            {/* Current */}
            {pokedex[selectedIndex] && (
              <img
                src={pokedex[selectedIndex].sprite}
                alt={pokedex[selectedIndex].name}
                style={{
                  width: "60%",
                  maxWidth: "400px",
                  objectFit: "contain",
                  zIndex: 2,
                  transition: "all 0.3s",
                }}
              />
            )}

            {/* Next */}
            {pokedex[selectedIndex + 1] && (
              <img
                src={pokedex[selectedIndex + 1].sprite}
                alt="next"
                style={{
                  position: "absolute",
                  transform: "translateY(90%) scale(0.8)",
                  opacity: 0.4,
                  width: "60%",
                  maxWidth: "300px",
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        </Col>

        {/* Pokémon List with Swiper */}
        <Col  xs={12} md={5} className="pokedex-list ms-md-auto">
         <Swiper
  direction="vertical"
  slidesPerView={window.innerWidth < 768 ? 6 : 12} // fewer items on mobile
  centeredSlides={true}
  spaceBetween={18}
  modules={[Mousewheel]}
  onSwiper={(swiper) => (swiperRef.current = swiper)}
  onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
  mousewheel={{
    forceToAxis: true,
    sensitivity: 2,
    releaseOnEdges: true,
  }}
  style={{ height: "100%", maxHeight: "80vh", paddingBottom: "2px" }} // let container decide
>

            {pokedex.map((poke, index) => (
              <SwiperSlide key={poke.name} style={{ height: "80px" }}>
                <div
                  className={`list-item ${
                    selectedIndex === index ? "active" : ""
                  }`}
                  onClick={() => selectPokemon(index)}
                >
                  #{index + 1} {poke.name}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
