export default function StorePriceList({ stores }) {
    return (
      <fieldset>
        <legend>Prix par magasin</legend>
        <ul>
          {stores.length > 0 ? (
            stores.map((item, index) => (
              <li key={index}>
                {item.magasin}: {item.prix} €
              </li>
            ))
          ) : (
            <li>Aucun magasin ajouté</li>
          )}
        </ul>
      </fieldset>
    );
  }
  