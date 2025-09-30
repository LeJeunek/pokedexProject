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

  if (isLoading) {
    return <div>Loading Pokedex...</div>;
  }

  if (isError) {
    return <div>Error Fetching Data</div>;
  }

  return (
    <Container fluid className="pokedex-container">
      <Row className="h-100">
        {/* Emblem */}
        <Col md={3}>
          <img src={pokeEmblem} className="pokeEmblem" alt="emblem" />
        </Col>

        {/* Pokémon Sprites */}
        <Col
          md={4}
          className="pokedex-left text-center d-flex justify-content-center align-items-center"
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginTop: "40px",
            }}
          >
            {/* Previous */}
            {pokedex[selectedIndex - 1] && (
              <img
                src={pokedex[selectedIndex - 1].sprite}
                alt="prev"
                style={{
                  maxWidth: "60%",
                  maxHeight: "60%",
                  opacity: 0.4,
                  transform: "translateY(-90%) scale(0.8)", // above
                  transition: "all 0.3s",
                  position: "absolute",
                  width: "400px",
                }}
              />
            )}

            {/* Current */}
            {pokedex[selectedIndex] && (
              <img
                src={pokedex[selectedIndex].sprite}
                alt={pokedex[selectedIndex].name}
                style={{
                  maxWidth: "80%",
                  maxHeight: "80%",
                  objectFit: "contain",
                  zIndex: 2,
                  transition: "all 0.3s",
                  width: "400px",
                }}
              />
            )}

            {/* Next */}
            {pokedex[selectedIndex + 1] && (
              <img
                src={pokedex[selectedIndex + 1].sprite}
                alt="next"
                style={{
                  maxWidth: "60%",
                  maxHeight: "60%",
                  opacity: 0.4,
                  transform: "translateY(90%) scale(0.8)", // below
                  transition: "all 0.3s",
                  position: "absolute",
                  width: "400px",
                }}
              />
            )}
          </div>
        </Col>

        {/* Pokémon List with Swiper */}
        <Col
          md={5}
          className="pokedex-list"
          style={{ height: "85vh", marginTop: "60px", marginLeft: "60px" }}
        >
          <Swiper
            direction="vertical"
            slidesPerView="auto"
            centeredSlides={true}
            spaceBetween={10}
            modules={[Mousewheel]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
            mousewheel={true}
            style={{ height: "100%" }}
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
