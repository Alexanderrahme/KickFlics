type Shoe = {
    id: string;
    name: string;
    price: number;
    description: string;
    image: any;
  };
  
  const shoeDatabase: Shoe[] = [
    {
      id: "1",
      name: "Nike AirForce 1",
      price: 179,
      description: "A modern take on the iconic Nike AirForce 1, perfect for casual wear and sports.",
      image: require("../../assets/images/AirForce1s.png"),
    },
    {
      id: "2",
      name: "Nike Air Jordan 1 Retro High OG",
      price: 414,
      description: "The classic Nike Jordan 1s that offer both comfort and style.",
      image: require("../../assets/images/Air_Jordan_1s.png"),
    },
    {
      id: "3",
      name: "Converse Chuck 70 Vintage Canvas High",
      price: 128,
      description: "The timeless Converse All Stars, suitable for all occasions.",
      image: require("../../assets/images/Chuck_70_Vintage.png"),
    },
    {
      id: "4",
      name: "Vans Old Skool 'Black White'",
      price: 95,
      description: "The versatile Vans Authentics, great for skateboarding or casual wear.",
      image: require("../../assets/images/Vans_Old_Skool.png"),
    },
    {
      id: "5",
      name: "Under Amour Ripple 2.0",
      price: 125,
      description: "",
      image: require("../../assets/images/Under_Armour_Ripple.png"),
    },
  ];
  
  export default shoeDatabase;
  