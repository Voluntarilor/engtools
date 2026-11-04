import { fmt } from '../../utils.js';

// Данные из таблицы химстойкости эластомеров
const ELASTOMER_DATA = [
  // Часть 1
  { chem: '(o)-Chlorophenol', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: '(p)-Cymene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: '1,2-Diaminoethane', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: '1,4-Dihydroxybenzene', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: '1-Butanethiol', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: '1-Hexadecanol', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: '2-Methylpentane', epdm: '4', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: '2-Propanone (Acetone)', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: '2-Propene-1-ol', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: '3,1-Dichloropropene', epdm: '4', fkm: '5', cr: '4', nbr: '4', hnbr: '4' },
  { chem: '3-Methylpentane', epdm: '4', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Acet Aldehyde', epdm: '2', fkm: '4', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Acet Aldehyde', epdm: '2', fkm: '4', cr: '5', nbr: '4', hnbr: '4' },
  
  // Часть 2
  { chem: 'Acetamide', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Acetic Acid', epdm: '1', fkm: '3', cr: '2', nbr: '3', hnbr: '3' },
  { chem: 'Acetic Acid Chloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetic Acid Vapors', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetic acid, 96-99.5% (Glacial)', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetic Anhydride', epdm: '2', fkm: '4', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Acetone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetophenone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetylacetone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetylchloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Acetylene Gas', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Acetylene Tetrabromide', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },

  // Часть 3
  { chem: 'Acrolein', epdm: '1', fkm: '4', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Acrylonitrile', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Adipic Acid', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Adipic Aciddiethylester', epdm: '1', fkm: '4', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Aero Lubriplate', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aero safe 2300', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Aero safe 2300 W', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Aero Shell 1 AC Grease', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Aero Shell 17 Grease', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Aero Shell 7 A Grease', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Aero Shell 750', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Aero Shell Fluid 4', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },

  // Часть 4
  { chem: 'Aerozene 50 (50%Hydrazine,50%UDMH)', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Air', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Alcohol (Methanol)', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Alkyl Arylsulphonic Acid', epdm: '1', fkm: '4', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Alkyl Benzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Allyl Alcohol (2-Propene-1-ol)', epdm: '1', fkm: '2', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Allyl Chloride (3-Chloro-1-Propene)', epdm: '4', fkm: '5', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Allyl Ketone', epdm: '1', fkm: '4', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Aluminium Acetat', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Aluminium Acetat', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Aluminium Bromide', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aluminium Fluoride', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 5
  { chem: 'Aluminium Nitrate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aluminium Phosphate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aluminium Sulfate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aluminum-Potassiumsulfate Solution', epdm: '1', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Aluminum Chloride Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aluminum Hydroxide Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aluminum Sulphate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ambrex 33 (Mobile)', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ambrex 830 (Mobile)', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Amines, primary (such as Methyl, Ethyl, Propyl, Allyl)', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Aminoacetic Acid', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Ammonia (gas)', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 6
  { chem: 'Ammonia (gas, hot)', epdm: '2', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Ammonia (liquid)', epdm: '1', fkm: '4', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Ammonia Solution', epdm: '1', fkm: '4', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Ammonia, anhydrous', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ammonia, aqueous Solution', epdm: '1', fkm: '4', cr: '1', nbr: '3', hnbr: '3' },
  { chem: 'Ammonia-Lithium', epdm: '2', fkm: '4', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Ammonium Acetate', epdm: '1', fkm: '4', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Carbonate', epdm: '1', fkm: '4', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Carbonate Solution', epdm: '1', fkm: '5', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Ammonium Chloride', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Chloride Solution', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Fluoride', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 7
  { chem: 'Ammonium Hydroxide', epdm: '1', fkm: '4', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Ammonium Hydroxide Solution', epdm: '1', fkm: '4', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Ammonium Nitrate Solution', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Nitrite', epdm: '1', fkm: '5', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Phosphate, Monobasic, Dibasic, Tribasic', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Sulfate Solution', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ammonium Sulfide', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Ammonium Thiocyanate', epdm: '1', fkm: '5', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Amyl Acetate', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Amyl Alcohol', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Amyl Borate', epdm: '4', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Amyl Chloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Amyl Naphtalene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Anderol L-774', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Aniline Chlorohydrate', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Aniline Liquid', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Animal Fats', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Anisole', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Antimony Chloride', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Antimony Chloride, dry', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aqua Regia (Nitric Acid/Hydrochloric Acid)', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Argon Gas', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Aromatic Fuels (up to 50% Aromatic)', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Aromatic Hydrocarbons (100% Aromatic)', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Arsenic Acid', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Arsenic Acid, Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Asphalt, Emulsion', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'ASTM Test Fuel A', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'ASTM Test Fuel B', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'ASTM Test Fuel C', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'ASTM-Oil IRM 902', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'ASTM-Oil IRM 903', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'ASTM-Oil No.1', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'ASTM-Oil No.2', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'ASTM-Oil No.3', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'ATM-Brake Fluid (Glycolbased)', epdm: '1', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },

  // Часть 8
  { chem: 'Automatic-Transmission Fluid', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Automotive Gasoline', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Barium Carbonate', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Barium Chloride Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Barium Hydroxide Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Barium Nitrate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Barium Sulfate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Barium Sulfide Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Battery Acid (Sulfuric Acid diluted)', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Beef Tallow', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Beer', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Beet Sugar Sap', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Benzaldehyde', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Benzenesulfonic Acid', epdm: '5', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Benzine (Gasoline)', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Benzine 50 / Benzene 30 / Ethanol 20', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Benzine 50 / Benzene 50', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Benzine 60 / Benzene 40', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Benzine 70 / Benzene 30', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Benzine 80 / Benzene 20', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Benzoic Acid, Solution', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Benzol (Benzene)', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Benzophenone', epdm: '2', fkm: '1', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Benzyl Alcohol', epdm: '2', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Benzyl Chloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Biphenyl', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bitumen', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Black Liquor', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Blast Furnace Gas', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Blast Furnace Gas', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bleach Solution', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bleaching Powder Solution', epdm: '1', fkm: '1', cr: '2', nbr: '3', hnbr: '3' },
  { chem: 'Boiler Feed Water', epdm: '1', fkm: '2', cr: '3', nbr: '2', hnbr: '2' },
  { chem: 'Bone Oil', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Borax (Sodiumborate)', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Borax Solutions', epdm: '1', fkm: '2', cr: '4', nbr: '2', hnbr: '2' },

  // Часть 9
  { chem: 'Boric Acid', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Brake Fluids', epdm: '1', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Bromine', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bromine Solution in Water', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bromine Vapour', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bromobenzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bromochlortrifluorethan', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Bunker Oil', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Butadiene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butandiol', epdm: '1', fkm: '4', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Butane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Butanole', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Butantriol', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Butene', epdm: '4', fkm: '1', cr: '3', nbr: '2', hnbr: '2' },
  { chem: 'Buthylphenol', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butter', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Buttermilk', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Butyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Acrylate', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Alcohol', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Butyl Amine', epdm: '5', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Carbitol', epdm: '1', fkm: '3', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Cellosolve', epdm: '1', fkm: '4', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Butyl Diglycol', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Butyl Phthalate', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Pyrocatechol', epdm: '2', fkm: '1', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Butyl Stearate', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Butylbenzoate', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butylene', epdm: '4', fkm: '1', cr: '3', nbr: '2', hnbr: '2' },
  { chem: 'Butylether', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyraldehyd', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyraldehyd', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Butyric Acid', epdm: '4', fkm: '1', cr: '3', nbr: '2', hnbr: '2' },
  { chem: 'Butyric Acid Butyl Ester', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Calcium Acetate', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },

  // Часть 10
  { chem: 'Calcium Bisulfate', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Bisulfide Solution', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Calcium Carbonate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Carbonate Slurry', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Chloride', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Chloride, brine', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Cyanide', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Hydroxide Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Hypochlorite Solution', epdm: '1', fkm: '1', cr: '2', nbr: '3', hnbr: '3' },
  { chem: 'Calcium Nitrate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Oxide', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Phosphate Slurry', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Silikate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Sulfate', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Sulfide', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Sulfite', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Calcium Thiosulfate', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Caliche Solution (Sodium Nitrate)', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Campher', epdm: '4', fkm: '2', cr: '2', nbr: '2', hnbr: '1' },
  { chem: 'Campher Oil', epdm: '4', fkm: '2', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Cane Sugar Sap', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Carbitol', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Carbolic Acid (Pencle)', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Carbolineum', epdm: '2', fkm: '1', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Carbon Dioxide, dry', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Carbon Dioxide, wet', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Carbon Disulfide', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Carbon Disulfide', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Carbon Monoxide', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Carbonic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Carboxylic Acids', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Casein', epdm: '2', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Castor Oil', epdm: '2', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Cellosolve (2-Ethoxyethanol)', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Cellulose', epdm: '2', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Celluloseacetat', epdm: '2', fkm: '4', cr: '4', nbr: '1', hnbr: '1' },

  // Часть 11
  { chem: 'Chile Salpetre (Sodium Nitrate)', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Chinawood Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Chloracetic Acid', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloracetic Acid Ethylester', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloric Acid', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloride of Lime', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorine Dioxide', epdm: '3', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorine gas, anhydrous', epdm: '1', fkm: '1', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Chlorine Water', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorine, liquid', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloroacetaldehyde', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloroacetone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloroamine', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Chlorobenzene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorobromomethane', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorobutadiene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloroform', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloroform', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloromethyl Ether', epdm: '3', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chloronaphthalene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorosulfonic Acid', epdm: '3', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorthene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chlorotoluene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chrome Alum', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Chromic Acid', epdm: '3', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Chromo sulfuric Acid', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Cider', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Citric Acid', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Citrous Oils', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Coal Tar', epdm: '4', fkm: '2', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Cobalt Chlorite', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Coca-Cola', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Cocoa Butter', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Coconut Grease', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Coconut Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Coconut, Fatty Acid', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 12
  { chem: 'Cod-liver Oil', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Coffee', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Coffee Extract', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Coke Oven Gas', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Copper Acetate Solution', epdm: '2', fkm: '4', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Copper Ammonium Acetate', epdm: '2', fkm: '4', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Copper Chloride, Solution', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Copper Cyanide', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Copper Fluoride', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Copper Nitrate', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Copper Sulfate (Blue Vitriol) Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Corn Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Cotton Oil', epdm: '3', fkm: '1', cr: '3', nbr: '1', hnbr: '1' },
  { chem: 'Cottonseed Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Cresol', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Crotonaldehyde', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Crude Oil', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Crude Oil', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Cumene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Cuprous Ammonia Acetate Solution', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Cyanic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Cyanic Acid Solution', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Cyclohexane', epdm: '4', fkm: '1', cr: '3', nbr: '1', hnbr: '1' },
  { chem: 'Cyclohexanole', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Cyclohexanone', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Cyclohexanone', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Cyclohexylamine', epdm: '3', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'DDT Solutions (Kerosene Solvent)', epdm: '4', fkm: '1', cr: '3', nbr: '1', hnbr: '1' },
  { chem: 'DDT Solutions (Toluene Solvent)', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Decalin (Decahydronaphtalene)', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Decane', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Dextrin', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Dextrose', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Diacetone', epdm: '1', fkm: '4', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Diacetone Alcohol', epdm: '1', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Diamylamine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },

  // Часть 13
  { chem: 'Diazinone', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibenzyl Sebacate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibenzylether', epdm: '2', fkm: '3', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Dibromodifluoromethane', epdm: '2', fkm: '5', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibromomethylbenzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibutyl Ether', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibutyl Phthalate', epdm: '2', fkm: '3', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibutyl Sebacate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dibutylamine', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloro Acetic Acid', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloro Acetic Acid Methylester', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichlorobutane', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Dichlorobutylene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloroethane', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloroethylene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloro-iso-propylene ether', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloromethane', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dichloropentane', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dicholorobenzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dicyclohexylamine', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diesel Fuel', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Diesel Oil', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Diethanolamine', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Amin', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Aniline', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Benzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Carbonate', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Ether', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Formaldehye', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Hydrazine', epdm: '1', fkm: '4', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Diethyl Maleate', epdm: '1', fkm: '4', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Diethyl Sebacate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diethyl Sulfate', epdm: '5', fkm: '4', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Diethylene Glycol', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Diethylene Triamine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diglycolic Acid', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 14
  { chem: 'Dihexyl Phthalic Acid Ester', epdm: '5', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dihydoxy Tartaric Acid (Tartaric Acid)', epdm: '2', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Di-Isobutyl Ketone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Di-Isobutylene', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Di-Isooctyl Sebacate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Di-Isopropyl Benzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Di-Isopropyl Ketone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethyl Amine', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethyl Aniline', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethyl Ether', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethyl Formamide', epdm: '2', fkm: '4', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Dimethyl Hydrazine', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Dimethyl Ketone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethyl Phenol', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethyl Phthalate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dimethylbutane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Dinitro Toluene', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dinitrogene Oxid', epdm: '2', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Dioctyl Amine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dioctyl Phthalate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dioctyl Sebacate', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dioxane', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dioxolane', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dipentene', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Diphenyl', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diphenyl Ether', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Diphenyle Oxide', epdm: '4', fkm: '1', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Dipropylene Glycol', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Dithionite', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Divinyl Benzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'DMT (Dimethyl Terephthalate)', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'DNCB (Dinitrochlorobenzene)', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Dodecanol', epdm: '2', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Dodecanol', epdm: '2', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Domestic Fuel Oils', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Dowtherm A', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },

  // Часть 15
  { chem: 'Dowtherm E', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Duodecanol (Laurylalcohol)', epdm: '2', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Epichlorhydrin', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Essential Oils', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ethanol Amine', epdm: '2', fkm: '4', cr: '3', nbr: '3', hnbr: '3' },
  { chem: 'Ether', epdm: '3', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Acrylate', epdm: '5', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Alcohol, Ethanol', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ethyl Benzene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Bromide', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Ethyl Cellulose', epdm: '2', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Ethyl Hexanole', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ethyl Oxalate', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Pentachlorobenzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Pyridine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethyl Sulfate (Diethyl Sulfate)', epdm: '1', fkm: '4', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Ethylacrylate', epdm: '5', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylchloride', epdm: '2', fkm: '2', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Ethylchloroacetate', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Ethylene', epdm: '4', fkm: '1', cr: '3', nbr: '1', hnbr: '1' },
  { chem: 'Ethylene Bromide', epdm: '3', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Chloride', epdm: '2', fkm: '2', cr: '2', nbr: '5', hnbr: '5' },
  { chem: 'Ethylene Chlorohydrin', epdm: '2', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Diamine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Dibromide', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Dichloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Glycol', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ethylene Glycol Ethylether (Cellosolve)', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Oxide', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ethylene Silicate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ethylene Trichloride', epdm: '3', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },

  // Часть 16
  { chem: 'Fats (animal/vegetable)', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Fatty Acids', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Ferric Chloride Solution', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ferric Nitrates', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ferric Sulfate (Ferric Vitrinol)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Ferric Sulfate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Fir Oil', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Fish Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Fluorine', epdm: '4', fkm: '3', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Fluorobenzene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Fluorosilicic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Formaldehyde (Formalin-Solution)', epdm: '1', fkm: '4', cr: '4', nbr: '3', hnbr: '3' },
  { chem: 'Formaldehyde (Methanal)', epdm: '1', fkm: '2', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Formamide', epdm: '2', fkm: '2', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Formic Acid', epdm: '2', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Freon 11', epdm: '4', fkm: '2', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Freon 112', epdm: '4', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Freon 113', epdm: '4', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 114', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 114 B2', epdm: '4', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Freon 115', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 12', epdm: '2', fkm: '2', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Freon 13', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 13 B1', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 134 a', epdm: '1', fkm: '5', cr: '5', nbr: '5', hnbr: '1' },
  { chem: 'Freon 14', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 142 b', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 152 a', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 21', epdm: '4', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Freon 218', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 22', epdm: '1', fkm: '4', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Freon 31', epdm: '1', fkm: '4', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Freon 32', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon 502', epdm: '1', fkm: '2', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Freon BF', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Freon C316', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 17
  { chem: 'Freon C318', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon MF', epdm: '4', fkm: '2', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Freon PCA', epdm: '4', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon TA', epdm: '1', fkm: '4', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon TC', epdm: '2', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon TF', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon TMC', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Freon T-P35', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Freon TWD602', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Fruit Juices', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Fumaric Acid', epdm: '5', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Furan', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Furfural (Furfurylaldehyde)', epdm: '5', fkm: '5', cr: '5', nbr: '3', hnbr: '3' },
  { chem: 'Furfurylalcohol', epdm: '5', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Gallic Acid', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Gas Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline / Alcohol Mix', epdm: '4', fkm: '2', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Gasoline, 100 Octane', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline, 130 Octane', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline, aromatic', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline, Ethyl and Regular', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline, Refined', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline, Sour', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gasoline, with Mercaptan', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Gelatin', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Generator Gas', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Glaubers Salt', epdm: '2', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Glucose solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Glucose, aqueos', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Glycerin (Glycerol)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Glycerol', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Glycerol Chlorohydrin', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Glycerol Triacetate (Triacetin)', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Glycerol Trinitrate (Nitroglycerin)', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Glycine', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Glycolic Acid', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 18
  { chem: 'HEF-3', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Helium Gas', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Heptane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Hexachloro Acetone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hexachloro Butadiene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hexachloro Butadiene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hexachloro Cyclohexane (Lindane)', epdm: '4', fkm: '1', cr: '4', nbr: '5', hnbr: '5' },
  { chem: 'Hexafluorosilicic Acid', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Hexafluorosilicic Acid', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Hexaldehyd', epdm: '1', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Hexalin (Cyclohexanol)', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Hexamine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hexanal', epdm: '2', fkm: '4', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Hexanal (Capronaldehyde)', epdm: '2', fkm: '4', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Hexane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Hexanetriol', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Hexene', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Hexyl Alcohol', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Hydrazine', epdm: '1', fkm: '3', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Hydrazine Hydrate', epdm: '1', fkm: '3', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Hydrobromic Acid', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydrochloric Acid (Muriatic Acid) 37%', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydrocyanic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Hydrofluoric Acid (cold)', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydrofluoric Acid (hot)', epdm: '4', fkm: '4', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Hydrogen Chloride Gas', epdm: '1', fkm: '1', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Hydrogen Fluoride', epdm: '2', fkm: '5', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydrogen Peroxide, concentrated', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydrogen Sulfide', epdm: '1', fkm: '1', cr: '2', nbr: '3', hnbr: '3' },
  { chem: 'Hydrogen, Gas', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Hydrogene Bromide, unhydrous', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydrogensulfite Leach', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Hydroquinone', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydroxy Acetic Acid', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hydroxylamine', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Hydroxylamine Sulfate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 19
  { chem: 'Hypochlorous Acid', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Hypochlorous Acid', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Ink', epdm: '1', fkm: '2', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Iodine', epdm: '2', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Iodine tincture', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Iodoform', epdm: '1', fkm: '1', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Iodoform', epdm: '1', fkm: '1', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Iso-Butane', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Iso-Butyl Alcohol', epdm: '1', fkm: '2', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Iso-Butyl Methyl Ketone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Iso-Butylene', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Iso-Butyraldehyde', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Iso-Cyanate', epdm: '1', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Iso-Dodecane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Iso-Octane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Iso-Pentane', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Iso-Propyl-Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Iso-Propyl-Alcohol', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Iso-Propyl-Benzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Iso-Propyl-Chloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Iso-Propyl-Ether', epdm: '5', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Jet Fuel JP3', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Jet Fuel JP4', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Jet Fuel JP5', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Jet Fuel JP6', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'JP3 (Fuel)', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'JP4 (Fuel)', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'JP5 (Fuel)', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'JP6 (Fuel)', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'JPX (Fuel)', epdm: '4', fkm: '4', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Kerosene', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Ketchup', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Lactams', epdm: '4', fkm: '4', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Lactic Acid', epdm: '2', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Lanolin', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Lanolin', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 20
  { chem: 'Latex', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Laughing Gas (N2O)', epdm: '2', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Lavender Oil', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Lead Acetate Salt Solution', epdm: '1', fkm: '4', cr: '4', nbr: '3', hnbr: '3' },
  { chem: 'Lead Arsenate', epdm: '1', fkm: '5', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Lead Nitrate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Lead Nitrate Solution', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Lead Sulfate', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Lemon Juice', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ligroin', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Lindol', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Linoleic Acid', epdm: '4', fkm: '2', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Linseed Oil', epdm: '3', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Liqueurs', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Lithium Bromide Brine', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Lithium Chloride', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Lithium Hydroxide', epdm: '1', fkm: '3', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Machinery Oil (mineral)', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Manganese Chloride ( Solution )', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Magnesium Acetate Solution', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Magnesium Chloride Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Magnesium Hydroxide (Solution)', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Magnesium Silicate (Talcum)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Magnesium Sulfate (Epson Salts)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Maleic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Maleic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Maleic Anhydride', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Malic Acid', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Margarine', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Mayonaise', epdm: '4', fkm: '4', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Menthol', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Mercaptans', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Mercuric Chloride Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Mercury', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Mercury Nitrate', epdm: '1', fkm: '5', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Mesityl Oxide', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },

  // Часть 21
  { chem: 'Methacrylic Acid', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methanal', epdm: '1', fkm: '2', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Methane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Methanol', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Methoxy Benzene', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methoxy Butanol', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Methyl Acetate', epdm: '2', fkm: '4', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Acetate', epdm: '1', fkm: '4', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Acetoacetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Acrylate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Alcohol', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Methyl Amine', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Aniline', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Bromide', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Butyl Ketone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Carbonate', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Cellosolve', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Cellulose', epdm: '2', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Methyl Chloride', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Cyclopentane', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Ethyl Ketone', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Ethyl Ketone', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Formate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Formate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Glycol', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Glycol Acetate (Ethyleneglycol)', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Iso-Butyl Ketone', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Iso-Propyl Ketone', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Methacrylate', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Methacrylic Acid Ester', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Oleate', epdm: '2', fkm: '1', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Phenyl Ether (Anisole)', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Pyrrolidone', epdm: '1', fkm: '4', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Methyl Salicylate', epdm: '2', fkm: '5', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Methylene Chloride', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Milk', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 22
  { chem: 'Milk of Lime', epdm: '1', fkm: '2', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Mine Gas (Methane)', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Mineral Oil', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Mineral Spirits', epdm: '4', fkm: '1', cr: '3', nbr: '1', hnbr: '1' },
  { chem: 'Molasses', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Monobromobenzene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Monochloroacetic Acid', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Monochloroacetic Acid Ethyl Ester', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Monochlorobenzene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Monoethanol Amine', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Mononitrochlorobenzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Morpholine', epdm: '2', fkm: '5', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Morpholine', epdm: '2', fkm: '5', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Muriatic Acid (HCl) (Hydrochloric Acid)', epdm: '2', fkm: '1', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Muriatic Acid (HCl), diluted', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Naphtha', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Naphthalene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Naphthenic Acid', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Naphtolen ZD', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Natural Gas', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Neats Foot Oil', epdm: '2', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Neon Gas', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Nickel Acetate', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Nickel Chloride', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Nickel Nitrate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Nickel Sulfate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Nitrating Acids', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitric Acid, concentrated', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitric Acid, fuming', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitro Benzene', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitro Glycerin', epdm: '1', fkm: '1', cr: '3', nbr: '4', hnbr: '4' },
  { chem: 'Nitro Glycol', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Nitro Methane', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitro Propane', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitro Toluene', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nitrogen Gas', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 23
  { chem: 'Nitrogen Tetroxide', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Nonanol', epdm: '1', fkm: '1', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Nut Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Octadecane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Octal', epdm: '2', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Octane', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Octanol (Octylalcohol)', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Octylalcohol', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Octicresol', epdm: '4', fkm: '2', cr: '4', nbr: '3', hnbr: '3' },
  { chem: 'Oil of Turpentine', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Olefin, crude', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Oleic Acid', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Oleic Alcohol', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Oleum (Sulfuric Acid, 0 to 50%)', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Olive Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Ortho Dichloro Benzene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Oxalic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Oxalic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Ozone', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '3' },
  { chem: 'Palm Kernel Oil', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Palm Oil', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Palmitic Acid', epdm: '3', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Para Dichloro Benzene', epdm: '4', fkm: '1', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Paraffin', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Paraffin', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Paraffin Oil', epdm: '4', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Peanut Oil', epdm: '4', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Pectin', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Penta Chloro Diphenyl', epdm: '4', fkm: '3', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Penta Chloro Phenol', epdm: '2', fkm: '5', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Pentane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Pentanol', epdm: '1', fkm: '2', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Perchloric Acid', epdm: '2', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Perchloric Acid', epdm: '2', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Perchloro Ethylene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Petroleum', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 24
  { chem: 'Petroleum Ether', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Phenol', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Phenyl Benzene', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Phenyl Ether', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Phenyl Hydrazine', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Phosphine', epdm: '1', fkm: '2', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Phosphine', epdm: '1', fkm: '2', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Phosphor Trichloride', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Phosphoric Acid', epdm: '2', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Phosphoric Acid 45%', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Photographic Developing Bath', epdm: '2', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Phthalic Acid', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Phthalic Anhydride', epdm: '1', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Picoline, alpha', epdm: '1', fkm: '4', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Picric Acid, Aqueous Solution', epdm: '2', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Pine Oil', epdm: '4', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Pineapple Juice', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Pinene', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Piperidine', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Polyvinyl Acetates', epdm: '1', fkm: '4', cr: '2', nbr: '5', hnbr: '5' },
  { chem: 'Potassium Acetate', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Aluminium Sulfat', epdm: '1', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Potassium Bicarbonate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Bisulfate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Borate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Bromate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Bromide', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Carbonate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Chlorate', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Potassium Chloride', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Chromate', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Cyanide', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Cyanide', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Dichromate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Hydroxide ( Solution 50% )', epdm: '1', fkm: '3', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Hydroxide, Potassium Lye', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },

  // Часть 25
  { chem: 'Potassium Hypochlorite (Javelle Water)', epdm: '2', fkm: '1', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Hypochlorite (Javelle water)', epdm: '2', fkm: '1', cr: '5', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Iodide', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Nitrate', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Perchlorate', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Potassium Perfluoroacetate', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Potassium Permanganate', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Potassium Persulfate', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Potassium Phosphate', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Sulfate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Potassium Sulfite', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Propane', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Propanol', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Propanol', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Propinyl Alcohol', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Propion Aldehyde', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Propionic Acid', epdm: '5', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Propyl Acetate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Propyl Acetone', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Propyl Amine', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Propyl Nitrate', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Propylene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Propylene Dichloride', epdm: '4', fkm: '5', cr: '5', nbr: '4', hnbr: '4' },
  { chem: 'Propylene Glycol', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Propylene Oxide', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Pyridine', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Pyrole', epdm: '4', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Rapeseed Oil', epdm: '4', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Roast Gas (dry)', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Rosin (Colophony)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Salicylic Acid', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Salicylic Acid', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Sea Water', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sea Water', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sea Water', epdm: '1', fkm: '2', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sewage', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },

  // Часть 26
  { chem: 'Silicone grease', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Silicic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Silicon Dioxide', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Silicone Oil', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Silver Cyanide Solution', epdm: '4', fkm: '1', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Silver Nitrate', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Silver Salts', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Skydrol 500', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Skydrol 7000', epdm: '1', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Soap Solution', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Soda (Natrium Carbonate)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Acetate', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Benzoate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Bicarbonate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Bisulfate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Bisulfite Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Borate (Borax)', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Carbonate (Soda Ash)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Carbonate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Chlorate', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Chloride (Common Salt)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Chloride Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Chlorite', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Sodium Cyanide Solution', epdm: '1', fkm: '5', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Dichromate', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Fluoride', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Hydroxide', epdm: '1', fkm: '3', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Hydroxide, Caustic Soda', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Hypochlorite Solution', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Nitrate', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Nitrite', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Sodium Peroxide Solution', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Phosphate', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Silicate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: "Sodium Sulfate (Glauber's Salts) Solution", epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Sulfhydrate Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },

  // Часть 27
  { chem: 'Sodium Sulfide', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Sulfite Solution', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Sodium Tetraborate Solution', epdm: '1', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Thiosulfate', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Sodium Thiosulfate (Antichlor)', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Soy Bean Oil', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sperm Oil', epdm: '2', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Spermaceti', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Spirits', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Stannic Chloride Solution', epdm: '1', fkm: '1', cr: '4', nbr: '1', hnbr: '1' },
  { chem: 'Starch', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Stearic Acid', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Stoddard Solvent', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Styrene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Succinic Acid', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sucrose Sap', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sugar Solutions', epdm: '1', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Sulfur', epdm: '1', fkm: '1', cr: '1', nbr: '4', hnbr: '4' },
  { chem: 'Sulfur Hexafluoride (SF6)', epdm: '1', fkm: '2', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Sulfur Chloride', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Sulfur Dioxide (SO2)', epdm: '1', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Sulfur Dioxide Liquid (anhydrous)', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Sulfur Dioxide, gaseous', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Sulfuric Acid (0 to 50%)', epdm: '1', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Sulfuric Acid, diluted', epdm: '1', fkm: '1', cr: '4', nbr: '2', hnbr: '2' },
  { chem: 'Sulfurous Acid', epdm: '2', fkm: '1', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Talcum', epdm: '1', fkm: '1', cr: '5', nbr: '1', hnbr: '1' },
  { chem: 'Tallow', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Tannins', epdm: '2', fkm: '1', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Tar', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Tartaric Acid', epdm: '2', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Tetrachloroethane', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Tetrachloroethane', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Tetrachloromethane', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Tetrachloromethane', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Tetrachloroethylene', epdm: '4', fkm: '1', cr: '4', nbr: '4', hnbr: '4' },

  // Часть 28
  { chem: 'Vinegar', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Vinyl Acetate', epdm: '5', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Vinyl Chloride, liquid', epdm: '5', fkm: '5', cr: '5', nbr: '5', hnbr: '5' },
  { chem: 'Vinylidene Chloride', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Waste Gas (cont. Carbon Dioxide)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Waste Gas (cont. Carbon Monoxide)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Waste Gas (cont. Hydrogen Chloride)', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Waste Gas (cont. Hydrogen Fluoride)', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Waste Gas (cont. Nitrous Fumes)', epdm: '1', fkm: '1', cr: '1', nbr: '5', hnbr: '5' },
  { chem: 'Waste Gas (cont. Sulfur Dioxide)', epdm: '1', fkm: '1', cr: '1', nbr: '2', hnbr: '2' },
  { chem: 'Waste Gas (cont. Sulfuric Acid)', epdm: '1', fkm: '1', cr: '2', nbr: '4', hnbr: '4' },
  { chem: 'Water steam < 150°C', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Water steam > 150°C', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Water to 180°F (80°C)', epdm: '1', fkm: '2', cr: '2', nbr: '2', hnbr: '1' },
  { chem: 'Water to 275°F (135°C)', epdm: '1', fkm: '3', cr: '3', nbr: '4', hnbr: '3' },
  { chem: 'Water vapour < 140°C', epdm: '1', fkm: '4', cr: '4', nbr: '4', hnbr: '3' },
  { chem: 'Water vapour > 140°C', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Wax Alcohols', epdm: '4', fkm: '1', cr: '2', nbr: '1', hnbr: '1' },
  { chem: 'Wine + Whiskey', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Wood Spirit', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Xenon', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Xylene (Xylol)', epdm: '4', fkm: '2', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Xylidines (aromatic Amines)', epdm: '2', fkm: '4', cr: '4', nbr: '4', hnbr: '4' },
  { chem: 'Yeast', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Zeolites', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Zinc Acetate', epdm: '1', fkm: '4', cr: '2', nbr: '2', hnbr: '2' },
  { chem: 'Zinc Chloride Solutions', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' },
  { chem: 'Zinc Sulfate', epdm: '1', fkm: '1', cr: '1', nbr: '1', hnbr: '1' }
];

export function renderElastomers(container) {
  container.innerHTML = `
    <style>
      /* Стили для аккордеона (серый блок) */
      .info-details { background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 20px; cursor: pointer; }
      .info-summary { font-weight: 600; color: var(--primary); font-size: 15px; outline: none; }
      .info-list { margin: 15px 0 0 0; padding-left: 20px; font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }
      
      /* Стили для быстрого поиска */
      .quick-find { display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap; align-items: center; }
      .qf-btn { padding: 6px 12px; background: #fff; border: 1px solid var(--border); border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 600; color: var(--primary); transition: 0.2s; }
      .qf-btn:hover, .qf-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

      /* Стили для таблицы */
      .nice-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; cursor: default; }
      .nice-table th { background-color: #334155; color: #ffffff; font-weight: 600; padding: 10px 8px; border: 1px solid #475569; text-align: center; }
      .nice-table td { border: 1px solid #e2e8f0; padding: 8px; text-align: center; }
      .nice-table tbody tr:nth-child(even) { background-color: #f8fafc; }
      .nice-table tbody tr:nth-child(odd) { background-color: #ffffff; }
      .nice-table tbody tr:hover { background-color: #e2e8f0; }
      .nice-table td:first-child { text-align: left; font-weight: 600; color: var(--primary); }
      
      /* Цветовая индикация */
      .rating-1 { background: #dcfce7; color: #166534; font-weight: bold; }
      .rating-2 { background: #fef9c3; color: #854d0e; font-weight: bold; }
      .rating-3 { background: #ffedd5; color: #9a3412; font-weight: bold; }
      .rating-4 { background: #fee2e2; color: #991b1b; font-weight: bold; }
      .rating-5 { background: #fca5a5; color: #7f1d1d; font-weight: bold; }
      .rating-NA { background: #f1f5f9; color: #64748b; font-weight: bold; }
      
      /* Легенда */
      .legend-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
      @media (max-width: 768px) { .legend-wrap { grid-template-columns: 1fr; } }
      .legend-box-container { background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 15px; }
      .legend-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; color: var(--primary); }
      .legend-grid { display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
      .legend-item { display: flex; align-items: flex-start; gap: 8px; }
      .legend-color { width: 20px; height: 20px; border-radius: 4px; border: 1px solid #ccc; flex-shrink: 0; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 11px;}
      
      .elastomer-list { display: grid; grid-template-columns: 60px 1fr; gap: 10px; font-size: 13px; }
      .elastomer-list strong { color: var(--primary); }
    </style>

    <!-- Серый блок с факторами -->
    <details class="info-details">
      <summary class="info-summary">ℹ️ General Chemical Resistance of Rubber Materials (Общие факторы влияния)</summary>
      <ul class="info-list">
        <li><b>1. Service Temperature (Рабочая температура):</b> Более высокие температуры вызывают более сильное воздействие химикатов на резину.</li>
        <li><b>2. Service Conditions (Условия работы):</b> Резина, которая сильно набухает, может подходить для статических условий, но выйти из строя в динамических приложениях.</li>
        <li><b>3. Grade of Polymer (Марка полимера):</b> Многие типы полимеров имеют различные марки, и это может повлиять на химическую стойкость.</li>
        <li><b>4. Types of Compound (Тип компаунда):</b> Смеси, разработанные для других выдающихся свойств, могут не обладать такой же хорошей химической стойкостью, как компаунды, специально созданные для этого.</li>
      </ul>
    </details>

    <div class="quick-find">
      <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">Quick Find:</span>
      <button class="qf-btn active" data-range="all">Все</button>
      <button class="qf-btn" data-range="AD">A-D</button>
      <button class="qf-btn" data-range="EM">E-M</button>
      <button class="qf-btn" data-range="NQ">N-Q</button>
      <button class="qf-btn" data-range="RT">R-T</button>
      <button class="qf-btn" data-range="UZ">U-Z</button>
    </div>

    <div class="corr-controls" style="margin-bottom: 15px;">
      <div class="field" style="flex: 1; min-width: 200px; margin-bottom: 0;">
        <input type="text" id="el-search" placeholder="Или введите название вещества для поиска..." style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px;">
      </div>
    </div>

    <div class="alu-table-container">
      <table class="nice-table">
        <thead>
          <tr>
            <th>Химическое вещество</th>
            <th>EPDM</th>
            <th>FKM</th>
            <th>CR</th>
            <th>NBR</th>
            <th>HNBR</th>
          </tr>
        </thead>
        <tbody id="el-tbody">
          <!-- Данные рендерятся скриптом -->
        </tbody>
      </table>
    </div>
    
    <!-- Легенда и расшифровка -->
    <div class="legend-wrap">
      <div class="legend-box-container">
        <div class="legend-title">Rating System (Система оценки)</div>
        <div class="legend-grid">
          <div class="legend-item"><div class="legend-color rating-1">1</div> <div><b>Very good suitability (Отлично).</b> Эластомер показывает слабое воздействие или его отсутствие. Отличная стойкость.</div></div>
          <div class="legend-item"><div class="legend-color rating-2">2</div> <div><b>Good suitability (Хорошо).</b> Незначительное воздействие с небольшой потерей физических свойств. Небольшое набухание.</div></div>
          <div class="legend-item"><div class="legend-color rating-3">3</div> <div><b>Limited suitability (Ограниченно).</b> Значительное набухание и потеря физических свойств. Требуются доп. испытания.</div></div>
          <div class="legend-item"><div class="legend-color rating-4">4</div> <div><b>Unsuitable (Не применять).</b> Эластомер непригоден для применения в этой среде.</div></div>
          <div class="legend-item"><div class="legend-color rating-5">5</div> <div><b>Insufficient info (Нет данных).</b> Недостаточно информации для оценки (или критическое разрушение).</div></div>
        </div>
      </div>

      <div class="legend-box-container">
        <div class="legend-title">Elastomer Legend (Типы эластомеров)</div>
        <div class="elastomer-list">
          <strong>EPDM</strong><span>Ethylene Propylene Diene Monomer (Этилен-пропиленовый каучук)</span>
          <strong>FKM</strong><span>Viton (Fluorocarbon Rubber / Фторкаучук)</span>
          <strong>CR</strong><span>Neoprene (Chloroprene / Неопрен, хлоропрен)</span>
          <strong>NBR</strong><span>Nitrile (Buna N / Нитрильный каучук)</span>
          <strong>HNBR</strong><span>Hydrogenated NBR (Гидрированный нитрильный каучук)</span>
        </div>
      </div>
    </div>
  `;

  const tbody = document.getElementById('el-tbody');
  const searchInput = document.getElementById('el-search');
  const qfBtns = document.querySelectorAll('.qf-btn');
  
  let activeRange = 'all';

  // Обработка кнопок быстрого поиска
  qfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRange = btn.dataset.range;
      renderTable();
    });
  });

  // Обработка текстового поиска
  searchInput.addEventListener('input', renderTable);

  function renderTable() {
    const query = searchInput.value.toLowerCase();
    
    // Сортировка по алфавиту
    const sortedData = [...ELASTOMER_DATA].sort((a, b) => a.chem.localeCompare(b.chem));
    
    const filtered = sortedData.filter(item => {
      const firstLetter = item.chem.charAt(0).toUpperCase();
      let matchRange = true;
      
      if (activeRange === 'AD') matchRange = (firstLetter >= 'A' && firstLetter <= 'D');
      else if (activeRange === 'EM') matchRange = (firstLetter >= 'E' && firstLetter <= 'M');
      else if (activeRange === 'NQ') matchRange = (firstLetter >= 'N' && firstLetter <= 'Q');
      else if (activeRange === 'RT') matchRange = (firstLetter >= 'R' && firstLetter <= 'T');
      else if (activeRange === 'UZ') matchRange = (firstLetter >= 'U' && firstLetter <= 'Z');

      const matchName = item.chem.toLowerCase().includes(query);
      return matchRange && matchName;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">Ничего не найдено</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const cell = (val) => {
        const v = val || 'N/A';
        const c = v === 'N/A' ? 'rating-NA' : `rating-${v}`;
        return `<td class="${c}">${v}</td>`;
      };
      
      return `
        <tr>
          <td>${item.chem}</td>
          ${cell(item.epdm)}
          ${cell(item.fkm)}
          ${cell(item.cr)}
          ${cell(item.nbr)}
          ${cell(item.hnbr)}
        </tr>
      `;
    }).join('');
  }

  renderTable();
}