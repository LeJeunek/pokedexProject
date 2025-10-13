import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import pokeEmblem from "./assets/pokemonEmblem.svg";
import "./index.css";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

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

  // Handle scroll to keep center item selected
  useEffect(() => {
    const handleScroll = () => {
      const list = listRef.current;
      if (!list) return;

      const scrollTop = list.scrollTop;
      const itemHeight = 80; // same as .list-item height in CSS
      const containerHeight = list.clientHeight;
      const centerY = scrollTop + containerHeight / 2;

      const index = Math.floor(centerY / itemHeight);
      if (index >= 0 && index < pokedex.length) {
        setSelectedIndex(index);
      }
    };

    const list = listRef.current;
    list?.addEventListener("scroll", handleScroll);
    return () => list?.removeEventListener("scroll", handleScroll);
  }, [pokedex]);

  if (isLoading) return <div>Loading Pokedex...</div>;
  if (isError) return <div>Error Fetching Data</div>;

  return (
    <Container fluid className="pokedex-container">
      <Row className="pokedex-row">
        {/* Title */}
        <h1 className="title">Pokedex</h1>

        {/* Rotating Emblem */}
        <img
          src={pokeEmblem}
          className="pokeEmblem"
          alt="emblem"
          style={{
            transform: `translateY(-50%) rotate(${selectedIndex * 25}deg)`,
          }}
        />

        {/* Pokémon Sprites */}
        <Col md={4} xs={12} className="pokedex-left mt-5 ">
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
                  maxWidth: "300px",
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        </Col>

        {/* Scrollable Pokémon List */}
        <Col md={5} xs={12} className="pokedex-list">
          <div className="scroll-list" ref={listRef}>
            {pokedex.map((poke, index) => (
              <div
                key={poke.name}
                className={`list-item ${
                  selectedIndex === index ? "active" : ""
                }`}
                onClick={() =>
                  listRef.current.scrollTo({
                    top: index * 80 - listRef.current.clientHeight / 2 + 40,
                    behavior: "smooth",
                  })
                }
              >
                #{index + 1} {poke.name}
                <span className="stats-link">
                  <Link
                    to={`/pokemon/${poke.name}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    STATS
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
