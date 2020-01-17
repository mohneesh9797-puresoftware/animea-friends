const fmodels = require('../src/models/friendlist.model');
const flservice = require('../src/services/friendListService');
const { Pact } = require("@pact-foundation/pact");

jest.setTimeout(60000);

describe("Cat's API", () => {
    let provider;

    beforeAll(async () => {
        const friendList = new fmodels.FriendList({"userId": "5e145b225591df48f0316f03", "friends": ["5e145acd5591df48f0316f02"]});

        dbFindOne = jest.spyOn(fmodels.FriendList, "findOne");
        dbFindOne.mockImplementation((query, callback) => {
            callback(null, friendList);
        });

        provider = new Pact({
            consumer: "FriendsApi",
            provider: "AnimesApi",
            port: 30303
        });

        await provider.setup();
    });

    afterAll(async () => {
        await provider.finalize();
    });
  
    describe("GET /friends/animes", () => {
        it('Retrieves friends animes', async () => {
            await provider.addInteraction({
                state: "I have a list of friends",
                uponReceiving: "a request for animes followed by friends",
                withRequest: {
                    method: "GET",
                    path: "/api/v1/user/5e145acd5591df48f0316f02/animes"
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: [
                        {
                            "id": "7442",
                            "type": "anime",
                            "links": {
                                "self": "https://kitsu.io/api/edge/anime/7442"
                            },
                            "attributes": {
                                "createdAt": "2013-02-20T17:55:59.054Z",
                                "updatedAt": "2020-01-17T18:48:53.986Z",
                                "slug": "attack-on-titan",
                                "synopsis": "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.\r\n\r\nAfter witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls. Based on Hajime Isayama's award-winning manga, Shingeki no Kyojin follows Eren, along with his adopted sister Mikasa Ackerman and his childhood friend Armin Arlert, as they join the brutal war against the titans and race to discover a way of defeating them before the last walls are breached.\r\n\r\n(Source: MAL Rewrite)",
                                "coverImageTopOffset": 263,
                                "titles": {
                                    "en": "Attack on Titan",
                                    "en_jp": "Shingeki no Kyojin",
                                    "en_us": "Attack on Titan",
                                    "ja_jp": "進撃の巨人"
                                },
                                "canonicalTitle": "Attack on Titan",
                                "abbreviatedTitles": [
                                    "AoT"
                                ],
                                "averageRating": "83.9",
                                "ratingFrequencies": {
                                    "2": "4350",
                                    "3": "100",
                                    "4": "681",
                                    "5": "97",
                                    "6": "622",
                                    "7": "78",
                                    "8": "7874",
                                    "9": "161",
                                    "10": "2355",
                                    "11": "304",
                                    "12": "5028",
                                    "13": "513",
                                    "14": "27141",
                                    "15": "1142",
                                    "16": "16499",
                                    "17": "1853",
                                    "18": "16848",
                                    "19": "1106",
                                    "20": "84200"
                                },
                                "userCount": 234572,
                                "favoritesCount": 5810,
                                "startDate": "2013-04-07",
                                "endDate": "2013-09-29",
                                "nextRelease": null,
                                "popularityRank": 1,
                                "ratingRank": 8,
                                "ageRating": "R",
                                "ageRatingGuide": "Violence, Profanity",
                                "subtype": "TV",
                                "status": "finished",
                                "tba": "",
                                "posterImage": {
                                    "tiny": "https://media.kitsu.io/anime/poster_images/7442/tiny.jpg?1418580054",
                                    "small": "https://media.kitsu.io/anime/poster_images/7442/small.jpg?1418580054",
                                    "medium": "https://media.kitsu.io/anime/poster_images/7442/medium.jpg?1418580054",
                                    "large": "https://media.kitsu.io/anime/poster_images/7442/large.jpg?1418580054",
                                    "original": "https://media.kitsu.io/anime/poster_images/7442/original.jpg?1418580054",
                                    "meta": {
                                        "dimensions": {
                                            "tiny": {
                                                "width": null,
                                                "height": null
                                            },
                                            "small": {
                                                "width": null,
                                                "height": null
                                            },
                                            "medium": {
                                                "width": null,
                                                "height": null
                                            },
                                            "large": {
                                                "width": null,
                                                "height": null
                                            }
                                        }
                                    }
                                },
                                "coverImage": {
                                    "tiny": "https://media.kitsu.io/anime/cover_images/7442/tiny.jpg?1519181478",
                                    "small": "https://media.kitsu.io/anime/cover_images/7442/small.jpg?1519181478",
                                    "large": "https://media.kitsu.io/anime/cover_images/7442/large.jpg?1519181478",
                                    "original": "https://media.kitsu.io/anime/cover_images/7442/original.png?1519181478",
                                    "meta": {
                                        "dimensions": {
                                            "tiny": {
                                                "width": 840,
                                                "height": 200
                                            },
                                            "small": {
                                                "width": null,
                                                "height": null
                                            },
                                            "large": {
                                                "width": 3360,
                                                "height": 800
                                            }
                                        }
                                    }
                                },
                                "episodeCount": 25,
                                "episodeLength": 24,
                                "totalLength": 600,
                                "youtubeVideoId": "LHtdKWJdif4",
                                "showType": "TV",
                                "nsfw": false
                            },
                            "relationships": {
                                "genres": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/genres",
                                        "related": "https://kitsu.io/api/edge/anime/7442/genres"
                                    }
                                },
                                "categories": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/categories",
                                        "related": "https://kitsu.io/api/edge/anime/7442/categories"
                                    }
                                },
                                "castings": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/castings",
                                        "related": "https://kitsu.io/api/edge/anime/7442/castings"
                                    }
                                },
                                "installments": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/installments",
                                        "related": "https://kitsu.io/api/edge/anime/7442/installments"
                                    }
                                },
                                "mappings": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/mappings",
                                        "related": "https://kitsu.io/api/edge/anime/7442/mappings"
                                    }
                                },
                                "reviews": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/reviews",
                                        "related": "https://kitsu.io/api/edge/anime/7442/reviews"
                                    }
                                },
                                "mediaRelationships": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/media-relationships",
                                        "related": "https://kitsu.io/api/edge/anime/7442/media-relationships"
                                    }
                                },
                                "characters": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/characters",
                                        "related": "https://kitsu.io/api/edge/anime/7442/characters"
                                    }
                                },
                                "staff": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/staff",
                                        "related": "https://kitsu.io/api/edge/anime/7442/staff"
                                    }
                                },
                                "productions": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/productions",
                                        "related": "https://kitsu.io/api/edge/anime/7442/productions"
                                    }
                                },
                                "quotes": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/quotes",
                                        "related": "https://kitsu.io/api/edge/anime/7442/quotes"
                                    }
                                },
                                "episodes": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/episodes",
                                        "related": "https://kitsu.io/api/edge/anime/7442/episodes"
                                    }
                                },
                                "streamingLinks": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/streaming-links",
                                        "related": "https://kitsu.io/api/edge/anime/7442/streaming-links"
                                    }
                                },
                                "animeProductions": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/anime-productions",
                                        "related": "https://kitsu.io/api/edge/anime/7442/anime-productions"
                                    }
                                },
                                "animeCharacters": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/anime-characters",
                                        "related": "https://kitsu.io/api/edge/anime/7442/anime-characters"
                                    }
                                },
                                "animeStaff": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/7442/relationships/anime-staff",
                                        "related": "https://kitsu.io/api/edge/anime/7442/anime-staff"
                                    }
                                }
                            },
                            "animeaAverage": 1.4285714285714286,
                            "userData": {
                                "_id": "5e1f921df1ac292e28e1d22c",
                                "anime_id": 7442,
                                "user_id": "5e145acd5591df48f0316f02",
                                "status": "watching",
                                "rating": 3,
                                "__v": 0
                            }
                        },
                        {
                            "id": "11469",
                            "type": "anime",
                            "links": {
                                "self": "https://kitsu.io/api/edge/anime/11469"
                            },
                            "attributes": {
                                "createdAt": "2015-10-27T22:39:09.949Z",
                                "updatedAt": "2020-01-17T18:48:39.131Z",
                                "slug": "boku-no-hero-academia",
                                "synopsis": "The appearance of \"quirks,\" newly discovered super powers, has been steadily increasing over the years, with 80 percent of humanity possessing various abilities from manipulation of elements to shapeshifting. This leaves the remainder of the world completely powerless, and Izuku Midoriya is one such individual.\r\n\r\nSince he was a child, the ambitious middle schooler has wanted nothing more than to be a hero. Izuku's unfair fate leaves him admiring heroes and taking notes on them whenever he can. But it seems that his persistence has borne some fruit: Izuku meets the number one hero and his personal idol, All Might. All Might's quirk is a unique ability that can be inherited, and he has chosen Izuku to be his successor!\r\n\r\nEnduring many months of grueling training, Izuku enrolls in U.A. High, a prestigious high school famous for its excellent hero training program, and this year's freshmen look especially promising. With his bizarre but talented classmates and the looming threat of a villainous organization, Izuku will soon learn what it really means to be a hero.\r\n\r\n(Source: MAL)",
                                "coverImageTopOffset": 200,
                                "titles": {
                                    "en": "My Hero Academia",
                                    "en_jp": "Boku no Hero Academia",
                                    "en_us": "My Hero Academia",
                                    "ja_jp": "僕のヒーローアカデミア"
                                },
                                "canonicalTitle": "Boku no Hero Academia",
                                "abbreviatedTitles": [],
                                "averageRating": "84.75",
                                "ratingFrequencies": {
                                    "2": "5686",
                                    "3": "117",
                                    "4": "344",
                                    "5": "71",
                                    "6": "347",
                                    "7": "89",
                                    "8": "5907",
                                    "9": "126",
                                    "10": "1214",
                                    "11": "224",
                                    "12": "2254",
                                    "13": "417",
                                    "14": "22959",
                                    "15": "1226",
                                    "16": "13256",
                                    "17": "2155",
                                    "18": "11641",
                                    "19": "1241",
                                    "20": "81448"
                                },
                                "userCount": 205809,
                                "favoritesCount": 3370,
                                "startDate": "2016-04-03",
                                "endDate": "2016-06-26",
                                "nextRelease": null,
                                "popularityRank": 5,
                                "ratingRank": 4,
                                "ageRating": "PG",
                                "ageRatingGuide": "Teens 13 or older",
                                "subtype": "TV",
                                "status": "finished",
                                "tba": "",
                                "posterImage": {
                                    "tiny": "https://media.kitsu.io/anime/poster_images/11469/tiny.jpg?1456690771",
                                    "small": "https://media.kitsu.io/anime/poster_images/11469/small.jpg?1456690771",
                                    "medium": "https://media.kitsu.io/anime/poster_images/11469/medium.jpg?1456690771",
                                    "large": "https://media.kitsu.io/anime/poster_images/11469/large.jpg?1456690771",
                                    "original": "https://media.kitsu.io/anime/poster_images/11469/original.png?1456690771",
                                    "meta": {
                                        "dimensions": {
                                            "tiny": {
                                                "width": null,
                                                "height": null
                                            },
                                            "small": {
                                                "width": null,
                                                "height": null
                                            },
                                            "medium": {
                                                "width": null,
                                                "height": null
                                            },
                                            "large": {
                                                "width": null,
                                                "height": null
                                            }
                                        }
                                    }
                                },
                                "coverImage": {
                                    "tiny": "https://media.kitsu.io/anime/cover_images/11469/tiny.jpg?1519181493",
                                    "small": "https://media.kitsu.io/anime/cover_images/11469/small.jpg?1519181493",
                                    "large": "https://media.kitsu.io/anime/cover_images/11469/large.jpg?1519181493",
                                    "original": "https://media.kitsu.io/anime/cover_images/11469/original.jpg?1519181493",
                                    "meta": {
                                        "dimensions": {
                                            "tiny": {
                                                "width": 840,
                                                "height": 200
                                            },
                                            "small": {
                                                "width": null,
                                                "height": null
                                            },
                                            "large": {
                                                "width": 3360,
                                                "height": 800
                                            }
                                        }
                                    }
                                },
                                "episodeCount": 13,
                                "episodeLength": 23,
                                "totalLength": 312,
                                "youtubeVideoId": "D5fYOnwYkj4",
                                "showType": "TV",
                                "nsfw": false
                            },
                            "relationships": {
                                "genres": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/genres",
                                        "related": "https://kitsu.io/api/edge/anime/11469/genres"
                                    }
                                },
                                "categories": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/categories",
                                        "related": "https://kitsu.io/api/edge/anime/11469/categories"
                                    }
                                },
                                "castings": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/castings",
                                        "related": "https://kitsu.io/api/edge/anime/11469/castings"
                                    }
                                },
                                "installments": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/installments",
                                        "related": "https://kitsu.io/api/edge/anime/11469/installments"
                                    }
                                },
                                "mappings": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/mappings",
                                        "related": "https://kitsu.io/api/edge/anime/11469/mappings"
                                    }
                                },
                                "reviews": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/reviews",
                                        "related": "https://kitsu.io/api/edge/anime/11469/reviews"
                                    }
                                },
                                "mediaRelationships": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/media-relationships",
                                        "related": "https://kitsu.io/api/edge/anime/11469/media-relationships"
                                    }
                                },
                                "characters": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/characters",
                                        "related": "https://kitsu.io/api/edge/anime/11469/characters"
                                    }
                                },
                                "staff": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/staff",
                                        "related": "https://kitsu.io/api/edge/anime/11469/staff"
                                    }
                                },
                                "productions": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/productions",
                                        "related": "https://kitsu.io/api/edge/anime/11469/productions"
                                    }
                                },
                                "quotes": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/quotes",
                                        "related": "https://kitsu.io/api/edge/anime/11469/quotes"
                                    }
                                },
                                "episodes": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/episodes",
                                        "related": "https://kitsu.io/api/edge/anime/11469/episodes"
                                    }
                                },
                                "streamingLinks": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/streaming-links",
                                        "related": "https://kitsu.io/api/edge/anime/11469/streaming-links"
                                    }
                                },
                                "animeProductions": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/anime-productions",
                                        "related": "https://kitsu.io/api/edge/anime/11469/anime-productions"
                                    }
                                },
                                "animeCharacters": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/anime-characters",
                                        "related": "https://kitsu.io/api/edge/anime/11469/anime-characters"
                                    }
                                },
                                "animeStaff": {
                                    "links": {
                                        "self": "https://kitsu.io/api/edge/anime/11469/relationships/anime-staff",
                                        "related": "https://kitsu.io/api/edge/anime/11469/anime-staff"
                                    }
                                }
                            },
                            "animeaAverage": 1.4285714285714286,
                            "userData": {
                                "_id": "5e1f956756784c0a80321dab",
                                "anime_id": 11469,
                                "user_id": "5e145acd5591df48f0316f02",
                                "status": "finished",
                                "rating": 5,
                                "__v": 0
                            }
                        }
                    ]
                }
            });

            const response = await flservice.getFriendAnimes('5e145acd5591df48f0316f02', '5e145acd5591df48f0316f02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck', null, null, null, true);
            expect(response.length).toEqual(2);
            await expect(provider.verify()).resolves.toBeTruthy();
        });
    });
  });