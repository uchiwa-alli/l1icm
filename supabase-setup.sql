-- =====================================================================
--  L1 ICM · EMIT Fianarantsoa
--  Comptes élèves + statistiques + espace admin
--  À coller UNE SEULE FOIS dans Supabase : SQL Editor > New query > Run
--  (on peut le relancer sans danger : il ne supprime rien)
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------- Tables -----------------------------------------------------
create table if not exists public.roster (
  num       int primary key,          -- numéro sur la fiche de présence
  person_id int  not null,            -- premier numéro de la personne (doublons regroupés)
  name      text not null
);

create table if not exists public.members (
  num             int primary key references public.roster(num),   -- = person_id
  name            text not null,
  pass_hash       text not null,
  role            text not null default 'member' check (role in ('member','admin')),
  status          text not null default 'pending'
                  check (status in ('pending','active','suspended','banned','rejected')),
  suspended_until timestamptz,
  note            text,
  facebook        text,
  photo           text,
  bg_admin        boolean not null check (bg_admin),               -- case « Bg ny admin » obligatoire
  created_at      timestamptz not null default now(),
  last_login      timestamptz,
  login_count     int not null default 0,
  fails           int not null default 0,
  locked_until    timestamptz
);

create table if not exists public.sessions (
  token_hash text primary key,
  num        int not null references public.members(num) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists public.visits (
  id   bigserial primary key,
  ts   timestamptz not null default now(),
  vid  text not null,
  page text not null,
  num  int
);
create index if not exists visits_ts_idx on public.visits (ts);

create table if not exists public.settings (
  skey text primary key,
  sval text not null
);
insert into public.settings (skey, sval) values ('class_code', 'CHANGE-MOI')
  on conflict (skey) do nothing;

-- ---------- Sécurité : personne ne lit les tables directement -----------
alter table public.roster   enable row level security;
alter table public.members  enable row level security;
alter table public.sessions enable row level security;
alter table public.visits   enable row level security;
alter table public.settings enable row level security;
revoke all on public.roster, public.members, public.sessions, public.visits, public.settings
  from anon, authenticated;
revoke all on sequence public.visits_id_seq from anon, authenticated;

-- ---------- Liste officielle de la classe -------------------------------
insert into public.roster (num, person_id, name) values
  (1, 1, 'ABDOUL SALAM Camara Manandily'),
  (2, 1, 'ABDOUL SALAM Camara Manandily'),
  (3, 1, 'ABDOUL SALAM Camara Manandily'),
  (4, 4, 'ANDOFANASINIAINA Fabrinah'),
  (5, 5, 'ANDRIAHERITIANA Olivier Feldman'),
  (6, 6, 'ANDRIAHITHARSON Theoddy Ephrem'),
  (7, 7, 'ANDRIAMALALA Miche Parson'),
  (8, 8, 'ANDRIAMALALA Bertinah Marinah'),
  (9, 9, 'ANDRIAMAMDAGNIRY Nomenjanahary Fortunat'),
  (10, 10, 'ANDRIAMANANDALANA Fanilo'),
  (11, 11, 'ANDRIAMANANTSOA Rose Estella'),
  (12, 12, 'ANDRIAMANARIVO Miradotiana Gabie Naphtaniel'),
  (13, 13, 'ANDRIAMBELOHASINDRAINY Tahiry Davidson'),
  (14, 14, 'ANDRIAMBOAVONJY NY ILO Henintsoa Sandrine'),
  (15, 15, 'ANDRIAMBOLOLONTSALAMA Mialinarivo Elya'),
  (16, 16, 'ANDRIAMIHAJA Nilaina Alexis'),
  (17, 17, 'ANDRIAMIHAJANARIVO Jean Olivier'),
  (18, 18, 'ANDRIAMIHARIJAONA Robertot'),
  (19, 19, 'ANDRIAMIOTAFISOA Tsiory Fitiavana'),
  (20, 20, 'ANDRIA NAMBININA Jean Victor'),
  (21, 21, 'ANDRIANAMBININTSOA Jacques Dominique'),
  (22, 22, 'ANDRIANANTOANY Solondraibe Anthonio Johnson'),
  (23, 23, 'ANDRIANARIJOELY Jonny Brice Marcel'),
  (24, 24, 'ANDRIANARISON Nohariejia Karenne'),
  (25, 25, 'ANDRIANARIVELO Noah Sandih'),
  (26, 26, 'ANDRIANARIVO Nantenaina Philbert Orlando'),
  (27, 27, 'ANDRIANASOLO Aimée Gladiace'),
  (28, 28, 'ANDRIANASOLO Iriela Mitsiry'),
  (29, 29, 'ANDRIANIAINA Fandresena Rica Sandrot'),
  (30, 30, 'ANDRIANIAINA Irinah ben Andress'),
  (31, 31, 'ANDRIANIAINA Valisoa Tanya'),
  (32, 32, 'ANDRIANILAINA Fitia Hervé'),
  (33, 33, 'ANDRIANINTSOA Tsimanahirana Karliano'),
  (34, 34, 'ANDRIANIRINA Rivo Hasilala'),
  (35, 35, 'ANDRIANIRINA Tsiriniony Lefitra'),
  (36, 36, 'ANDRIANJAFY Michel Rayan Lee'),
  (37, 37, 'ANDRIANJAKA Rackelle Allanah'),
  (38, 38, 'ANDRIANOMENJANAHARY Jack Johnson'),
  (39, 39, 'ANDRIANOTAHIANA Ravonirina Tahinisoa'),
  (40, 40, 'ANDRIANTSOA Lauriane Hélènah'),
  (41, 41, 'ANDRIARIAMANJAKA Tantely Nomena Harison'),
  (42, 42, 'ANDRIATSILAVINA Jacques Berthieu'),
  (43, 43, 'ANDRIATSITOHAINA Tinasoa Patrick'),
  (44, 44, 'ANJANDRAINY SAROBIDY Mickaela Francia'),
  (45, 45, 'ANJARALALAINA Andrianintsoa Barinala'),
  (46, 46, 'ANJARANIRINA Andoniaina Stephanie'),
  (47, 47, 'ANJARANOKASAINA Mioranjatovo Miranda'),
  (48, 48, 'ANJARASOA Sitrikiniaina Marinà'),
  (49, 49, 'ANTSAMPIFALIANA Felanajanahary Léoncia'),
  (50, 50, 'ANTSO SEDRANANDRAINA Manda Anne Mireille'),
  (51, 51, 'AVOTRANIAINA Najoro Finoana Naharitra'),
  (52, 52, 'AVOTRINIAINA Mendrika Haniela'),
  (53, 53, 'BEAVONY Jean Bruciano'),
  (54, 54, 'DAMY MAGNEFARIVO Dit Franco'),
  (55, 55, 'ELISSE Famindrasoa Nantenaina'),
  (56, 56, 'FALIARIVELO Nambinina Denève'),
  (57, 57, 'FAMENOMAMY Harenasoa Sarobidy Angelina'),
  (58, 58, 'FANAMBINANIAVO Hasinarivo Alberthin'),
  (59, 58, 'FANAMBINANIAVO Hasinarivo Alberthin'),
  (60, 60, 'FANAMBINANTSOA Barthélémy Alicia'),
  (61, 61, 'FANATANENANTSOA Eddy Olivio'),
  (62, 62, 'FANEVADERA Christian'),
  (63, 63, 'FANIRIAMBOLA Vanilla'),
  (64, 64, 'FANIRISOA Nantenaina Marcelline'),
  (65, 65, 'FANOMENZANTSOA Heritiana Ericka Karen'),
  (66, 66, 'FANOMEZANTSOA Emmanuela Fijaliana'),
  (67, 67, 'FANOMEZANTSOA Mangaline Francia'),
  (68, 68, 'FANOMEZANTSOA Nathasah Marcelline'),
  (69, 69, 'FANOMEZANTSOA Tolojanahary Fifaliana'),
  (70, 70, 'FANOMEZANTSOA Amour Philemon'),
  (71, 71, 'FENOMANANA Tanteliniaina Flavie Florentine'),
  (72, 72, 'FIAROVANTSOA Charles Boris'),
  (73, 73, 'FIDIARIMANANA Jerico braoten'),
  (74, 74, 'FIDIRATSARA Narcisse'),
  (75, 75, 'FITAHIANJANAHARY Charlotte'),
  (76, 76, 'FITAHIANTSOA Lionnel Bruce Elio'),
  (77, 77, 'FITIAVANA Iambinintsoa Elian'),
  (78, 78, 'HAJARINORO Lasta Victorine Naomi'),
  (79, 79, 'HANTANANAHARY Violette'),
  (80, 80, 'HARINANDRASANA Mamitiana Marie Clavie'),
  (81, 81, 'HARINELINA RASOANOMENJANAHARY Tiavina Ny Aina'),
  (82, 82, 'HASINIAINA Eldinon Eldace'),
  (83, 83, 'HERIMBAHINY SOMBINIAINA Liantsoa'),
  (84, 84, 'HERINIAINA Nadia Florena'),
  (85, 84, 'HERINIAINA Nadia Florena'),
  (86, 86, 'HERINIRINA Mamy Sitraka Aurélien'),
  (87, 87, 'IRINIAINA Eric'),
  (88, 88, 'JEAN Mena Félicien'),
  (89, 89, 'JEAN MANANA Elrick Alan'),
  (90, 90, 'JOSEPH David Samifaly'),
  (91, 91, 'JOSEPHINE Eugenie'),
  (92, 92, 'KANTONIAINA Tanteraka Anjarasoa'),
  (93, 93, 'KANTONIRINA Jean Miandrisoa'),
  (94, 93, 'KANTONIRINA Jean Miandrisoa'),
  (95, 95, 'KEMA Marcelline Noella'),
  (96, 96, 'KOURBANALY Lovaniaina Oliviette'),
  (97, 97, 'LALANEKENA Jeanne Anthonie'),
  (98, 98, 'LANJAMPITIA To Nohasoavina Vononkandresy'),
  (99, 99, 'LARIO Tsiatoro Velomiasy'),
  (100, 100, 'LOVASOA Fitahiana'),
  (101, 101, 'LUCIANA Claudette'),
  (102, 102, 'MAHAZOMILA Nantenaina Princia'),
  (103, 103, 'MAMIHARISOA Samirah Royalame'),
  (104, 104, 'MAMISOA Nanciah Abdoullinah'),
  (105, 105, 'MAMITIANA Lovasoa Mirah'),
  (106, 106, 'MANAGNANDRO Melissa Anais'),
  (107, 107, 'MANAMPISOA Fanevaniaina Yvette'),
  (108, 108, 'MANANDRINIRINA Fanja Melanie Marie'),
  (109, 109, 'MAHANJARA Ifaliana Sidonie'),
  (110, 110, 'MANGASOA Jeanne Marine'),
  (111, 111, 'MANOLA Yoni Emasindrae Hegekia Regis'),
  (112, 112, 'MANOVOLAHY Eric Donatien'),
  (113, 113, 'MARIAH Chrielle'),
  (114, 114, 'MARIE Madelène'),
  (115, 115, 'MAROLAHY Parfait zaccardo'),
  (116, 116, 'MBAZAHA Jean Richard Northon'),
  (117, 117, 'MENDRIKASINA Prixila Bernardà'),
  (118, 118, 'MIALINTSOA Prisca Aimée'),
  (119, 119, 'MICHELLE CHRISTINAH Mlalaniaina Princia'),
  (120, 120, 'MIHAJANDRAIBE Angela'),
  (121, 121, 'MILAMY Mahavory Dallas'),
  (122, 122, 'MIZA Veronique'),
  (123, 123, 'MOFANE Maicon'),
  (124, 124, 'MOINDJIE AHMED Melodiane'),
  (125, 125, 'NAMBININTSOA Diary Hasiniaina'),
  (126, 126, 'NAROVANIRINA Valimbavaka Stephano'),
  (127, 127, 'NAROVANJANAHARY Michael Fleurys'),
  (128, 128, 'NIRINASOA Stéphanie Justine Pierrette'),
  (129, 129, 'NIRINELA Vahatriniaina Nachioulla Francline'),
  (130, 129, 'NIRINELA VAHATRINIAINA Nachioulla Francline'),
  (131, 131, 'NJAKANERA Kevine Emmanuela Nesca'),
  (132, 132, 'NOMENA Estephania Arofenitra'),
  (133, 133, 'NOMENJAHARY Meldà Angelicia'),
  (134, 134, 'NOMENJANAHARY Fahasoavana Zimon Marcellin'),
  (135, 134, 'NOMENJANAHARY Fahasoavana Zimon Marcellin'),
  (136, 136, 'NOMENJANAHARY Mbolatiana Yannick'),
  (137, 137, 'NOMENJANAHARY Rosalie Jenny'),
  (138, 138, 'NOMENJANAHARY Nasandratriniavo Elia'),
  (139, 139, 'NOSOGNY Linot Emilson Tsimikora'),
  (140, 140, 'PRINCIA Théornah'),
  (141, 141, 'RABE Andriantsoa Sarobidy Sarah'),
  (142, 142, 'RABELAHY Joli Mariel'),
  (143, 143, 'RABELAHY Louisao Chatriani Sylvanne'),
  (144, 144, 'RABEMANANJARA Mitsinjoharisaina Elivah'),
  (145, 145, 'RABESAIKY Ainga Fitia'),
  (146, 146, 'RABEZANAHARY Sitrakiniavo Toky Amboaranirina Chancel'),
  (147, 147, 'RABIALAHY Heriniavo Angelin Marcello'),
  (148, 148, 'RAFANILISOA Angelà Honorine'),
  (149, 149, 'RAFANOMEZANTSOA Angel Anthonette'),
  (150, 150, 'RAFANOMEZANTSOA Jean Mario'),
  (151, 151, 'RAFANOMEZANTSOA Elinot Gabriel'),
  (152, 152, 'RAFARAZAFY Fitia Helvine Mazine'),
  (153, 153, 'RAFELANIAINA Luciana Vivaldi'),
  (154, 154, 'RAFIDY Eugène Rondie'),
  (155, 155, 'RAHAJANIRINA Zafindraibe Tsilavina'),
  (156, 156, 'RAHARIJOANA Lefitra Nandrianina'),
  (157, 157, 'RAHARIJAONA Tiavina José'),
  (158, 157, 'RAHARIJAONA Tiavina José'),
  (159, 159, 'RAHARIMANANA Andriamirindra Murna'),
  (160, 160, 'RAHARINIAINA Alison Ken'),
  (161, 161, 'RAHARINIRINA Notahinjanahary Yvon Ben Ybe'),
  (162, 162, 'RAHARINIRINA Ghyslaine'),
  (163, 163, 'RAHARIVELO Njaratiana Rotsy Fortuna'),
  (164, 164, 'RAHELIARISOA LUCENA Marie Oriance'),
  (165, 165, 'RAHELIARISOA Lusena Marie Oriance'),
  (166, 166, 'RAHELIMANANA Marie Roselina'),
  (167, 167, 'RAHERIARIVONY Fanomezantsoa Claudio'),
  (168, 168, 'RAHERINANTENAINA Jean Claude'),
  (169, 169, 'RAHERINIRINA Joseph Bruno'),
  (170, 169, 'RAHERINIRINA Joseph Bruno'),
  (171, 171, 'RAJAONANDRARASANA Clairine'),
  (172, 172, 'RAJAONARISON Eldinot'),
  (173, 173, 'RAJEMISOA Joela Ny Andry Andrianina'),
  (174, 174, 'RAJONIAINA Jessica'),
  (175, 175, 'RAKOTOARISOA Faustine Edmée'),
  (176, 176, 'RAKOTOARISOA Ravakianiaina José Emmanuel'),
  (177, 177, 'RAKOTOARISON Aina Rinatiana Ghyael'),
  (178, 177, 'RAKOTOARISON Aina Rinatiana Ghyael'),
  (179, 179, 'RAKOTOARISON Niry Marcelio'),
  (180, 180, 'RAKOTOARIVELO Herimamy Robin'),
  (181, 180, 'RAKOTOARIVELO Herimamy Robin'),
  (182, 182, 'RAKOTOARIVELO Sombiniaina Diamondra'),
  (183, 183, 'RAKOTOFALIARISOA Valisoa Cathia Andrée'),
  (184, 184, 'RAKOTOHASIMBOLA Tokinirina Manampisoa Justin'),
  (185, 185, 'RAKOTOMAHAZOMILA Maminiaina Marie Sylvie'),
  (186, 185, 'RAKOTOMAHAZOMILA Maminiaina Marie Sylvie'),
  (187, 187, 'RAKOTOMALALA Odon'),
  (188, 188, 'RAKOTONDRAMANANA Antsaniaina Mamisoa'),
  (189, 189, 'RAKOTONDRAMANANA Lahatriniaina Taratra'),
  (190, 190, 'RAKOTONDRAVOAVY Kanto'),
  (191, 191, 'RAKOTONIRAINY Aimé Pierre Eloi'),
  (192, 192, 'RAKOTONIRINA Fanevasoa Armand'),
  (193, 193, 'RALAISOAVELO Harinjanahary Ainanirina'),
  (194, 194, 'RALAIARISOA Jems Alli Figaël'),
  (195, 195, 'RALINARIVONY Miorasoa Olinah'),
  (196, 196, 'RAMAHAZONIAINA AMBININTSOA Ismael'),
  (197, 197, 'RAMAMBAVOLA Loock Marino'),
  (198, 197, 'RAMAMBAVOLA Loock Marino'),
  (199, 199, 'RAMAMPIANDRA Ny Aina Mitia'),
  (200, 200, 'RAMANAKASINA Mino'),
  (201, 201, 'RAMANANJATOSON Haingo Linah'),
  (202, 202, 'RAMANANKAVANA Andrianantenaina Danielson Orlando'),
  (203, 203, 'RAMANASON Léonce Martino'),
  (204, 204, 'RAMANDRIANA Harison Jean Fidelis'),
  (205, 205, 'RAMAROVAVY Nomenjanahary Elianne'),
  (206, 205, 'RAMAROVAVY Nomenjanahary Elianne'),
  (207, 207, 'RAMBELOSON Soanaly Neicka'),
  (208, 208, 'RAMBININTSOA Tafitaniaina Joseph'),
  (209, 209, 'RAMIANDRISOA Hervé'),
  (210, 210, 'RAMIARISOA Fandresana Tiavina'),
  (211, 211, 'RAMONJANIRINA Edena'),
  (212, 212, 'RAMONJARSOLO Natiora'),
  (213, 213, 'RANARIVELO Rofoniaina Emerentienne'),
  (214, 214, 'RANDIMBIARISON Tsanta Ny Aro'),
  (215, 215, 'RANDIMBINIRINA Jean Olivier'),
  (216, 216, 'RANDRIAMALALA Ravakiniaina Onjatiana'),
  (217, 217, 'RANDRIAMALAZA Victorien'),
  (218, 217, 'RANDRIAMALAZA Victorien'),
  (219, 219, 'RANDRIAMAMPANDRY Miarantsoa Jean Marc'),
  (220, 220, 'RANDRIAMAMPANDRY Miasantsoa Jean Mare'),
  (221, 221, 'RANDRIAMANAMPY Fanomezantsoa Edmond'),
  (222, 222, 'RANDRIAMANANKAVANA Aina Mitovamila Brondonne'),
  (223, 223, 'RANDRIAMANANTENA Natokisandraza Angelo'),
  (224, 223, 'RANDRIAMANANTENA Natokisandraza Angelo'),
  (225, 225, 'RANDRIAMAPIONONA Patrick'),
  (226, 226, 'RANDRIAMBOLOLONA Nehemia'),
  (227, 227, 'RANDRIAMBOLOLOSON Tolojanahary Eugène'),
  (228, 228, 'RANDRIAMIAHAJA Solofniaina Tojosoa'),
  (229, 229, 'RANDRIAMIALISOA Laingo Tiana Emilson'),
  (230, 230, 'RANDRIAMIHAJA Delvina'),
  (231, 231, 'RANDRIAMIHAJANIRINA Harson'),
  (232, 232, 'RANDRIAMITSIRISOA Jonathan Julio'),
  (233, 233, 'RANDRIANA Ravakianiaina Onjatiana'),
  (234, 234, 'RANDRIANAIRAVELONA Ambinintsoa Laurio'),
  (235, 235, 'RANDRIANAIVORAVELONA Alvin Lovaniaina'),
  (236, 236, 'RANDRIANAMBININA Noah Gabriel'),
  (237, 237, 'RANDRIANANTENAINA Leonardo Eugene kevin'),
  (238, 238, 'RANDRIANANTENAINA TIAVINA Jean Oeude'),
  (239, 239, 'RANDRIANARISOA Sombiniaina Liantsoa'),
  (240, 240, 'RANDRIANASOAVINA Ronaldo Ronaldo'),
  (241, 241, 'RANDRIANASOLO SAFIDINJANAHARY Evrianne'),
  (242, 242, 'RANDRIANOMENJANAHARY Stanislas'),
  (243, 243, 'RANDRIANSOLO Abdoulwade'),
  (244, 244, 'RANDRIARMANANKAVANA Aina Mitovamila Brondonne'),
  (245, 245, 'RANOELISON Tefinjanahary Henri Jimmy Trie'),
  (246, 246, 'RANOMENJAHARY José Yves'),
  (247, 247, 'RANOMENJANAHARY Nirinandrianina Tatianah'),
  (248, 248, 'RAPELANIAINA Lucianna vivaldi'),
  (249, 249, 'RASAMIMANANA John Cena'),
  (250, 250, 'RASAMOELINA NY Avo Mahery'),
  (251, 251, 'RASOAMAMPIONONA Henitsoa Vero Noeline'),
  (252, 252, 'RASOANANDRASANA Clairine'),
  (253, 253, 'RASOANANDRASANA Angelah Virginie'),
  (254, 254, 'RASOANANTENAIONA Manarivo Angelicia'),
  (255, 255, 'RASOANIRINA Vivialisoa Nicole Marella'),
  (256, 256, 'RASOANIRINA Charline'),
  (257, 257, 'RASOANIRINA Tojoandrainy Georgine'),
  (258, 258, 'RASOARIMANANA Judickael Princia'),
  (259, 259, 'RASOARIVELO Anthonia Christelle'),
  (260, 260, 'RASOLONDRAIBE Jean Baptiste Marcelinot'),
  (261, 261, 'RATAHINISOA Anjaratiavina Josoa Sandros'),
  (262, 262, 'RATOLOJANAHARY Herijaona'),
  (263, 263, 'RATOVOSON Fenosoa Tahiry'),
  (264, 264, 'RATSIMBAZAFINDRAMASY Mbolatiamiagola Anjara'),
  (265, 265, 'RATSIMBAZAFINDRAMASY Mbolatiamiangola Anjara'),
  (266, 266, 'RAVALISOAMAMPIONONA Emelie'),
  (267, 267, 'RAVANOSOA Fetraniaina Nancia'),
  (268, 268, 'RAVELONOSY Mananandro Gustave'),
  (269, 269, 'RAVONIARISON Muriel Olivier'),
  (270, 270, 'RAZAFIANDRIANOGNITSOA Michel'),
  (271, 271, 'RAZAFIMAHATRATRA Jonah'),
  (272, 271, 'RAZAFIMAHATRATRA Jonah'),
  (273, 273, 'RAZAFIMANDIMBY Miarimanana Precis'),
  (274, 274, 'RAZAFIMIADANA Fierentantsoa Lanto Désiré'),
  (275, 275, 'RAZAFINDRABAO Lisianne'),
  (276, 276, 'RAZAFINDRADAHY Rose Candy'),
  (277, 276, 'RAZAFINDRADAHY Rose Candy'),
  (278, 278, 'RAZAFINDRAHARY Felaniaina Christine'),
  (279, 279, 'RAZAFINDRAIBE Bienvenue Alex'),
  (280, 279, 'RAZAFINDRAIBE Bienvenue Alex'),
  (281, 281, 'RAZAFINDRALAMBO Andoniaina Victoire'),
  (282, 282, 'RAZAFINDRAMAHA Nomenjanahary jacquinot'),
  (283, 283, 'RAZAFINDRAMANGA Gremaine Cephascia'),
  (284, 284, 'RAZAFINDRAMIZA Arnoldinia Mellodie'),
  (285, 285, 'RAZAFINDRASOA Santatra Flavienne'),
  (286, 286, 'RAZAFINDRASOA Solinah Espérence'),
  (287, 287, 'RAZAFINDRAVORY Manambelona Justine Sandrine'),
  (288, 288, 'RAZAFINDRAZANAKOTO Barthinez'),
  (289, 289, 'RAZAFINIARIVO Johan Kenny'),
  (290, 290, 'RAZAFINIMANANA Narovaniavo Henintsoa'),
  (291, 291, 'RAZAFITIANANTSARA Madianah'),
  (292, 292, 'RAZAIVOLA Marie Jeanne Cathie Richma'),
  (293, 293, 'RAZANAJAFIARISOA Jandio'),
  (294, 294, 'RAZANAMANANA Haingolalaina Marie Sylvia'),
  (295, 295, 'RAZANANDRAZANA Nomenififaliana'),
  (296, 296, 'RAZAVAMILA Jeanne Christella'),
  (297, 297, 'RAZAZFINDRALAMBO Andiniaina Victor'),
  (298, 298, 'REMANITATSY Tolerand Fabrice'),
  (299, 298, 'REMANITATSY Tolerand Fabrice'),
  (300, 300, 'SAFIDISOA Dieu Donnée'),
  (301, 301, 'SAHANINJO Vavimaro sylviannie'),
  (302, 302, 'SAMBO Rema Gerard'),
  (303, 303, 'SANA Julia'),
  (304, 303, 'SANA Julia'),
  (305, 305, 'SANDANIAINA Tahirintsoa Ella'),
  (306, 306, 'SANTATRINIAINA Teddy Augusto'),
  (307, 307, 'SAOTRANJANAHARY Nomeny Fitiavana'),
  (308, 308, 'SITRAKINIAVO Tafitamalala Jean Princy'),
  (309, 309, 'SOANOMENA Noeline'),
  (310, 310, 'SOMBINIAINA Saidà Stéphanie'),
  (311, 311, 'TAFANGY Maminirina Murelah'),
  (312, 312, 'TAFARA Andrianasolojatovo Olivier Chrystal'),
  (313, 313, 'TAHINJANAHARY Francky Nathanael'),
  (314, 314, 'TAHINJANAHARY Tsioriniaina Jeanne d Arc'),
  (315, 315, 'TANJONARISOA Jeanne Françine'),
  (316, 316, 'TANJONIRINA Robinson'),
  (317, 317, 'TEFINORAINY Quensy Saofy'),
  (318, 318, 'TIANDRAZA Voizenah'),
  (319, 319, 'TIAVINJANAHARY Savio Augustin'),
  (320, 320, 'TINA'),
  (321, 321, 'TOAVINDRAINY Soloheritsalama'),
  (322, 322, 'TOHANDRAINY Rynnah Christelle'),
  (323, 323, 'TOKINIAINA Gérard Parson'),
  (324, 324, 'TOVONIAINA Ratsiravainarisoa Mariah Thérèse'),
  (325, 325, 'TSARAVA Harizo Fleurisse'),
  (326, 326, 'TSIFOLAKARIVOHERIMISAFIDY Fuldjawahanlal Cythelis'),
  (327, 327, 'TSIORIMBOLATIANA Aicha Hakim Ya sin'),
  (328, 328, 'TSIORIMBOLATIANA Aicha Hakim Ya-sin'),
  (329, 329, 'TSIORY HERINIAINA Tinah'),
  (330, 330, 'TSIRESIMILA Jenacia Olivah'),
  (331, 330, 'TSIRESIMILA Jenacia Olivah'),
  (332, 332, 'TSIRINIAINA Zaratiana Christelle'),
  (333, 333, 'TSIVERILAZA Gaspard reacando'),
  (334, 334, 'VAKISOA Florentine Haingondrainy Zoé Nathalie'),
  (335, 335, 'VALISOA Chandra Felicia'),
  (336, 335, 'VALISOA Chandra Felicia'),
  (337, 337, 'VELONJANAHARY Mamenosoa Dolar'),
  (338, 338, 'VOAHANGINIRINA Basilisse'),
  (339, 339, 'VOLOLONANTENAINA Diany Mirantsoa'),
  (340, 340, 'VOLOLONIAINA Fanomezantsoa'),
  (341, 341, 'VOLOLONIRINA Marie Elysabeth Seraphine'),
  (342, 342, 'WILLY Hervio'),
  (343, 343, 'ZAFERINAE Joséphine'),
  (344, 344, 'ZAFINTSEHEFA Fidy Anicet'),
  (345, 345, 'ZAFITAHINY Ninah Ricci Ambroisine')
on conflict (num) do update set person_id = excluded.person_id, name = excluded.name;

-- ---------- Fonctions internes (non appelables depuis le site) ----------
create or replace function public._fb(p text) returns text
language plpgsql immutable set search_path = public as $$
declare v text := nullif(trim(coalesce(p, '')), '');
begin
  if v is null then return null; end if;
  if length(v) > 300 or v !~* '^https://([a-z0-9-]+\.)*(facebook\.com|fb\.com|fb\.me)(/|\?|$)' then
    raise exception 'Lien Facebook invalide (il doit commencer par https://www.facebook.com/...)';
  end if;
  return v;
end $$;

create or replace function public._ph(p text) returns text
language plpgsql immutable set search_path = public as $$
declare v text := nullif(trim(coalesce(p, '')), '');
begin
  if v is null then return null; end if;
  if length(v) > 400 or (v !~* '^https://[^ ]+$' and v !~* '^photos/[A-Za-z0-9._-]+$') then
    raise exception 'Lien de photo invalide (https://... ou photos/nom.jpg)';
  end if;
  return v;
end $$;

create or replace function public._profile(p_num int) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'num', num, 'name', name, 'role', role, 'status', status,
    'suspended_until', suspended_until, 'facebook', facebook, 'photo', photo,
    'created_at', created_at)
  from public.members where num = p_num
$$;

create or replace function public._me(p_token text) returns public.members
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members;
begin
  if p_token is null or length(p_token) < 40 then return null; end if;
  select mb.* into m
    from public.sessions s join public.members mb on mb.num = s.num
   where s.token_hash = encode(digest(p_token, 'sha256'), 'hex')
     and s.expires_at > now();
  if not found then return null; end if;
  if m.status = 'suspended' and m.suspended_until is not null and m.suspended_until <= now() then
    update public.members set status = 'active', suspended_until = null where num = m.num;
    m.status := 'active';
    m.suspended_until := null;
  end if;
  return m;
end $$;

create or replace function public._need_active(p_token text) returns public.members
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members;
begin
  m := public._me(p_token);
  if m.num is null then raise exception 'Session expirée : reconnecte-toi'; end if;
  if m.status <> 'active' then raise exception 'Compte non actif'; end if;
  return m;
end $$;

create or replace function public._need_admin(p_token text) returns public.members
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members;
begin
  m := public._me(p_token);
  if m.num is null then raise exception 'Session expirée : reconnecte-toi'; end if;
  if m.role <> 'admin' or m.status <> 'active' then raise exception 'Accès refusé'; end if;
  return m;
end $$;

-- ---------- Fonctions utilisées par le site (élèves) --------------------
create or replace function public.register(
  p_num int, p_password text, p_code text, p_bg boolean, p_facebook text default null
) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare pid int; nm text; ex public.members;
begin
  if p_bg is not true then
    raise exception 'Tu dois cocher « Bg ny admin » pour t''inscrire';
  end if;
  if p_password is null or length(p_password) < 6 or length(p_password) > 60 then
    raise exception 'Mot de passe : entre 6 et 60 caractères';
  end if;
  if coalesce(p_code, '') <> coalesce((select sval from public.settings where skey = 'class_code'), '') then
    raise exception 'Code de classe incorrect';
  end if;
  select person_id into pid from public.roster where num = p_num;
  if pid is null then
    raise exception 'Numéro inconnu : seuls les élèves de la classe peuvent s''inscrire';
  end if;
  select name into nm from public.roster where num = pid;
  select * into ex from public.members where num = pid;
  if ex.num is not null and ex.status <> 'rejected' then
    raise exception 'Ce numéro est déjà inscrit. Connecte-toi, ou demande à l''admin de réinitialiser ton compte';
  end if;
  if ex.num is not null then delete from public.members where num = pid; end if;
  insert into public.members (num, name, pass_hash, bg_admin, facebook)
  values (pid, nm, crypt(p_password, gen_salt('bf')), true, public._fb(p_facebook));
  return jsonb_build_object('status', 'pending');
end $$;

-- login renvoie les erreurs dans le résultat (pour que le compteur d'essais soit enregistré)
create or replace function public.login(p_num int, p_password text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare pid int; m public.members; tok text;
begin
  select person_id into pid from public.roster where num = p_num;
  select * into m from public.members where num = pid;
  if m.num is null then
    return jsonb_build_object('error', 'Numéro ou mot de passe incorrect');
  end if;
  if m.locked_until is not null and m.locked_until > now() then
    return jsonb_build_object('error', 'Trop d''essais. Réessaie dans quelques minutes');
  end if;
  if m.pass_hash <> crypt(coalesce(p_password, ''), m.pass_hash) then
    update public.members
       set fails = case when fails + 1 >= 5 then 0 else fails + 1 end,
           locked_until = case when fails + 1 >= 5 then now() + interval '10 minutes' else locked_until end
     where num = m.num;
    return jsonb_build_object('error', 'Numéro ou mot de passe incorrect');
  end if;
  if m.status = 'banned' then
    return jsonb_build_object('error', 'Ce compte est banni.');
  end if;
  if m.status = 'rejected' then
    return jsonb_build_object('error', 'Ton inscription a été refusée par l''admin.');
  end if;
  if m.status = 'suspended' then
    if m.suspended_until is null or m.suspended_until > now() then
      return jsonb_build_object('error', 'Compte suspendu' ||
        case when m.suspended_until is null then '.'
             else ' jusqu''au ' || to_char(m.suspended_until at time zone 'Indian/Antananarivo', 'DD/MM/YYYY HH24"h"MI') end);
    end if;
    update public.members set status = 'active', suspended_until = null where num = m.num;
  end if;
  tok := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  insert into public.sessions (token_hash, num, expires_at)
  values (encode(digest(tok, 'sha256'), 'hex'), m.num, now() + interval '30 days');
  delete from public.sessions where expires_at < now();
  update public.members
     set fails = 0, locked_until = null, last_login = now(), login_count = login_count + 1
   where num = m.num;
  return jsonb_build_object('token', tok, 'profile', public._profile(m.num));
end $$;

create or replace function public.me(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members;
begin
  m := public._me(p_token);
  if m.num is null then return jsonb_build_object('error', 'expired'); end if;
  return public._profile(m.num);
end $$;

create or replace function public.logout(p_token text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  delete from public.sessions where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
end $$;

create or replace function public.update_profile(p_token text, p_facebook text, p_photo text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members;
begin
  m := public._need_active(p_token);
  update public.members
     set facebook = public._fb(p_facebook), photo = public._ph(p_photo)
   where num = m.num;
  return public._profile(m.num);
end $$;

create or replace function public.change_password(p_token text, p_old text, p_new text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members;
begin
  m := public._need_active(p_token);
  if m.pass_hash <> crypt(coalesce(p_old, ''), m.pass_hash) then
    raise exception 'Ancien mot de passe incorrect';
  end if;
  if p_new is null or length(p_new) < 6 or length(p_new) > 60 then
    raise exception 'Mot de passe : entre 6 et 60 caractères';
  end if;
  update public.members set pass_hash = crypt(p_new, gen_salt('bf')) where num = m.num;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.public_profiles() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('num', num, 'facebook', facebook, 'photo', photo)), '[]'::jsonb)
    from public.members where status = 'active'
$$;

create or replace function public.track(p_vid text, p_page text, p_token text default null) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members; pg text;
begin
  if p_vid is null or length(p_vid) < 8 or length(p_vid) > 64 then return; end if;
  pg := left(coalesce(nullif(p_page, ''), 'home'), 30);
  if exists (select 1 from public.visits
              where vid = p_vid and page = pg and ts > now() - interval '20 seconds') then
    return;
  end if;
  m := public._me(p_token);
  insert into public.visits (vid, page, num) values (p_vid, pg, m.num);
end $$;

-- ---------- Fonctions réservées à l'admin -------------------------------
create or replace function public.admin_stats(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  a public.members;
  d0 date := (now() at time zone 'Indian/Antananarivo')::date;
begin
  a := public._need_admin(p_token);
  return jsonb_build_object(
    'visits_total',   (select count(*) from public.visits),
    'visitors_total', (select count(distinct vid) from public.visits),
    'visits_today',   (select count(*) from public.visits where (ts at time zone 'Indian/Antananarivo')::date = d0),
    'visitors_today', (select count(distinct vid) from public.visits where (ts at time zone 'Indian/Antananarivo')::date = d0),
    'visits_7d',      (select count(*) from public.visits where (ts at time zone 'Indian/Antananarivo')::date > d0 - 7),
    'visitors_7d',    (select count(distinct vid) from public.visits where (ts at time zone 'Indian/Antananarivo')::date > d0 - 7),
    'visits_30d',     (select count(*) from public.visits where (ts at time zone 'Indian/Antananarivo')::date > d0 - 30),
    'visitors_30d',   (select count(distinct vid) from public.visits where (ts at time zone 'Indian/Antananarivo')::date > d0 - 30),
    'days', (
      select coalesce(jsonb_agg(jsonb_build_object('d', to_char(g.d, 'YYYY-MM-DD'), 'v', coalesce(x.v, 0), 'u', coalesce(x.u, 0)) order by g.d), '[]'::jsonb)
        from generate_series((d0 - 13)::timestamp, d0::timestamp, interval '1 day') as g(d)
        left join (
          select (ts at time zone 'Indian/Antananarivo')::date as dd, count(*) as v, count(distinct vid) as u
            from public.visits group by 1
        ) x on x.dd = g.d::date
    ),
    'top_pages', (
      select coalesce(jsonb_agg(jsonb_build_object('page', t.page, 'n', t.n) order by t.n desc), '[]'::jsonb)
        from (select page, count(*) as n from public.visits
               where ts > now() - interval '30 days' group by page order by n desc limit 8) t
    ),
    'members', (
      select coalesce(jsonb_object_agg(t.status, t.n), '{}'::jsonb)
        from (select status, count(*) as n from public.members group by status) t
    ),
    'roster', (select count(distinct person_id) from public.roster)
  );
end $$;

create or replace function public.admin_members(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members;
begin
  a := public._need_admin(p_token);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'num', num, 'name', name, 'role', role, 'status', status,
      'suspended_until', suspended_until, 'note', note, 'facebook', facebook, 'photo', photo,
      'created_at', created_at, 'last_login', last_login, 'login_count', login_count) order by num)
    from public.members), '[]'::jsonb);
end $$;

create or replace function public.admin_set_status(
  p_token text, p_num int, p_status text, p_days int default null, p_note text default null
) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members; t public.members;
begin
  a := public._need_admin(p_token);
  select * into t from public.members where num = p_num;
  if t.num is null then raise exception 'Compte introuvable'; end if;
  if t.role = 'admin' then raise exception 'Impossible de modifier un compte admin'; end if;
  if p_status not in ('pending', 'active', 'suspended', 'banned', 'rejected') then
    raise exception 'Statut invalide';
  end if;
  update public.members
     set status = p_status,
         suspended_until = case when p_status = 'suspended'
                                then now() + make_interval(days => greatest(coalesce(p_days, 1), 1))
                                else null end,
         note = coalesce(nullif(trim(p_note), ''), note)
   where num = p_num;
  if p_status in ('suspended', 'banned', 'rejected') then
    delete from public.sessions where num = p_num;
  end if;
  return public._profile(p_num);
end $$;

create or replace function public.admin_update_member(
  p_token text, p_num int, p_name text, p_facebook text, p_photo text, p_note text
) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members;
begin
  a := public._need_admin(p_token);
  if not exists (select 1 from public.members where num = p_num) then
    raise exception 'Compte introuvable';
  end if;
  update public.members
     set name = coalesce(nullif(trim(p_name), ''), name),
         facebook = public._fb(p_facebook),
         photo = public._ph(p_photo),
         note = nullif(trim(coalesce(p_note, '')), '')
   where num = p_num;
  return public._profile(p_num);
end $$;

create or replace function public.admin_reset_password(p_token text, p_num int, p_password text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members;
begin
  a := public._need_admin(p_token);
  if p_password is null or length(p_password) < 6 or length(p_password) > 60 then
    raise exception 'Mot de passe : entre 6 et 60 caractères';
  end if;
  update public.members
     set pass_hash = crypt(p_password, gen_salt('bf')), fails = 0, locked_until = null
   where num = p_num;
  if not found then raise exception 'Compte introuvable'; end if;
  delete from public.sessions where num = p_num;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_delete_member(p_token text, p_num int) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members; t public.members;
begin
  a := public._need_admin(p_token);
  select * into t from public.members where num = p_num;
  if t.num is null then raise exception 'Compte introuvable'; end if;
  if t.role = 'admin' then raise exception 'Impossible de supprimer un compte admin'; end if;
  delete from public.members where num = p_num;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_bulk_approve(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members; n int;
begin
  a := public._need_admin(p_token);
  update public.members set status = 'active' where status = 'pending';
  get diagnostics n = row_count;
  return jsonb_build_object('approved', n);
end $$;

create or replace function public.admin_get_code(p_token text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members;
begin
  a := public._need_admin(p_token);
  return (select sval from public.settings where skey = 'class_code');
end $$;

create or replace function public.admin_set_code(p_token text, p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.members;
begin
  a := public._need_admin(p_token);
  if p_code is null or length(trim(p_code)) < 4 or length(p_code) > 40 then
    raise exception 'Code : entre 4 et 40 caractères';
  end if;
  update public.settings set sval = trim(p_code) where skey = 'class_code';
  return jsonb_build_object('ok', true);
end $$;

-- ---------- Création du compte admin (à lancer à la main, voir le guide) -
create or replace function public.setup_admin(p_num int, p_password text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare pid int;
begin
  select person_id into pid from public.roster where num = p_num;
  if pid is null then raise exception 'Numéro inconnu dans la liste'; end if;
  if p_password is null or length(p_password) < 8 then
    raise exception 'Mot de passe admin : 8 caractères minimum';
  end if;
  insert into public.members (num, name, pass_hash, role, status, bg_admin)
  values (pid, (select name from public.roster where num = pid),
          crypt(p_password, gen_salt('bf')), 'admin', 'active', true)
  on conflict (num) do update
     set pass_hash = excluded.pass_hash, role = 'admin', status = 'active';
  return 'Compte admin prêt pour le N° ' || pid;
end $$;

-- ---------- Droits : qui peut appeler quoi ------------------------------
revoke all on function public._fb(text)          from public, anon, authenticated;
revoke all on function public._ph(text)          from public, anon, authenticated;
revoke all on function public._profile(int)      from public, anon, authenticated;
revoke all on function public._me(text)          from public, anon, authenticated;
revoke all on function public._need_active(text) from public, anon, authenticated;
revoke all on function public._need_admin(text)  from public, anon, authenticated;
revoke all on function public.setup_admin(int, text) from public, anon, authenticated;

grant execute on function public.register(int, text, text, boolean, text)       to anon, authenticated;
grant execute on function public.login(int, text)                               to anon, authenticated;
grant execute on function public.me(text)                                       to anon, authenticated;
grant execute on function public.logout(text)                                   to anon, authenticated;
grant execute on function public.update_profile(text, text, text)               to anon, authenticated;
grant execute on function public.change_password(text, text, text)              to anon, authenticated;
grant execute on function public.public_profiles()                              to anon, authenticated;
grant execute on function public.track(text, text, text)                        to anon, authenticated;
grant execute on function public.admin_stats(text)                              to anon, authenticated;
grant execute on function public.admin_members(text)                            to anon, authenticated;
grant execute on function public.admin_set_status(text, int, text, int, text)   to anon, authenticated;
grant execute on function public.admin_update_member(text, int, text, text, text, text) to anon, authenticated;
grant execute on function public.admin_reset_password(text, int, text)          to anon, authenticated;
grant execute on function public.admin_delete_member(text, int)                 to anon, authenticated;
grant execute on function public.admin_bulk_approve(text)                       to anon, authenticated;
grant execute on function public.admin_get_code(text)                           to anon, authenticated;
grant execute on function public.admin_set_code(text, text)                     to anon, authenticated;

-- ---------- ÉTAPES À FAIRE ENSUITE (une par une, dans une nouvelle requête)
-- 1) Créer TON compte admin (remplace 194 par ton numéro et choisis un VRAI mot de passe) :
--      select public.setup_admin(194, 'TonMotDePasseAdminIci');
-- 2) Changer le code de classe (à donner aux camarades dans le groupe Messenger) :
--      update public.settings set sval = 'MonCodeSecret' where skey = 'class_code';
