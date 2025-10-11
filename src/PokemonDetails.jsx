import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const PokemonDetails = () => {
  const { name } = useParams();

  const fetchPokemonDetail = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();

    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    return {
      ...data,
      description: speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      )?.flavor_text,
    };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: fetchPokemonDetail,
    enabled: !!name,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Pokémon details.</div>;
    if (!data) return <div>No data found.</div>;

  return (
    <div className="pokemon-detail">
        <Link to="/" className="back-btn">Back to Pokedex</Link>
        <div className="img-block">
            <h2>{data.name.toUpperCase()}</h2>       
             <img src={data.sprites.front_default} alt={data.name} className="desc-img"/>
            <ul>
            <li>Height: {data.height}</li>
            <li>Weight: {data.weight}</li>
        </ul></div>
        <div className="info-block"><p>{data.description}</p></div>
        

        

    </div>
  )
  

};

export default PokemonDetails