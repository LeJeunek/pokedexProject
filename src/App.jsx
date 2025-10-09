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
        <h1 className="title">Pokedex</h1>
        <Col md={3} className="rotateLogo">
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
        <Col md={4} sm={12} className="pokedex-left mt-5 ">
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
                className="img-fluid"
                style={{
                  position: "absolute",
                  transform: "translateY(-90%) scale(0.8)",
                  opacity: 0.4,
                  width: "80%",
                  maxWidth: "400px",
                  transition: "all 0.3s",
                }}
              />
            )}

            {/* Current */}
            {pokedex[selectedIndex] && (
              <img
                src={pokedex[selectedIndex].sprite}
                alt={pokedex[selectedIndex].name}
                className="img-fluid"
                style={{
                  width: "60%",
                  maxWidth: "400px",

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
                className="img-fluid"
                style={{
                  position: "absolute",
                  transform: "translateY(90%) scale(0.8)",
                  opacity: 0.4,
                  width: "60%",
                  maxWidth: "400px",
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        </Col>

        {/* Pokémon List with Swiper */}
        <Col md={5} sm={12} className="pokedex-list">
          <Swiper
            direction="vertical"
            slidesPerView={12}
            centeredSlides={true}
            spaceBetween={10}
            modules={[Mousewheel]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 10,
              releaseOnEdges: true,
            }}
            style={{ height: "1100px", maxHeight: "80vh" }}
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
