import React, { useState, useEffect } from "react";
import Whiskeys from "./whiskey/whiskeys.json";
import styled from "styled-components";

const WhiskeyPage = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;

const WhiskeyList = styled.div`
    display: inline-block;
    height: 100%;
    width: 250px;
    background-color: #aa9378c7;
`;

const WhiskeyListUl = styled.ul`
    list-style: none;
    overflow-y: scroll;
    height: 439px;
    padding: 0;
    margin: 0;
`;
const WhiskeyListElement = styled.li`
    cursor: pointer;
    padding: 10px 0 10px 15px;
    background-color: ${(props) => (props.light ? "#bb8c56" : "#D3A46E")};
`;

const ActiveWhiskey = styled.div`
    height: 100%;
    width: 450px;
    background-color: #d8d4cec7;
    text-align: center;
    overflow-y: auto;
`;

const WhiskeyDetails = styled.ul`
    list-style: none;
    padding: 0;
    padding: 20px 0;
`;

const WhiskeyDetail = styled.li`
    margin: auto;
    width: 350px;
    display: flex;
    justify-content: space-between;
`;

const FilterDiv = styled.div`
    padding: 10px 0px;
    cursor: pointer;
    text-align: center;
`;

const ResetTitle = styled.div`
    padding: 10px 0px;
    cursor: pointer;
    text-align: center;
    background-color: #aa9378c7;
`;

const FilterPage = styled.div`
    height: 100%;
    width: 450px;
    background-color: #d8d4cec7;
    overflow-y: scroll;
`;

const CategoryFilter = styled.div`
    display: flex;
    height: 188px;
    border-bottom: 2px solid #aa9378c7;
`;

const CategoryTitle = styled.div`
    display: grid;
    align-items: center;
    width: 170px;
    text-align: center;
`;

const TasteFilter = styled.div`
    margin-top: 10px;
    display: flex;
`;

const TasteTitle = styled.div`
    padding-top: 18px;
    width: 170px;
    text-align: center;
`;

const Whiskey = () => {
    const [active, setActive] = useState();
    const [categories, setCategories] = useState([]);
    const [flavours, setFlavours] = useState([]);
    const [currentWhiskeys, setCurrentWhiskeys] = useState([]);

    const setActiveWhiskey = (name) => {
        const a = Whiskeys.find((w) => w.name === name);
        setActive(a);
    };

    useEffect(() => {
        const cats = [];
        const flavs = [];
        Whiskeys.map((w) => {
            w.taste.map((taste) => {
                const existingTaste = flavs.find((f) => f.label === taste);
                if (existingTaste) {
                    existingTaste.count++;
                } else {
                    flavs.push({ label: taste, count: 1, selected: false });
                }
            });

            const existingCategory = cats.find((c) => c.label === w.details.Category);
            if (!existingCategory) {
                cats.push({ label: w.details.Category || "missing", selected: false });
            }
        });
        cats.sort((a, b) => (a > b ? -1 : 1));
        flavs.sort((a, b) => {
            if (a.count === b.count) {
                return b.label < a.label ? 1 : -1;
            }
            return a.count < b.count ? 1 : -1;
        });
        setCategories(cats);
        setFlavours(flavs);
    }, []);

    const toggleCategory = (label) => {
        setCategories(
            categories.map((c) => {
                if (c.label !== label) return c;
                return { ...c, selected: !c.selected };
            })
        );
    };
    const toggleFlavour = (label) => {
        setFlavours(
            flavours.map((c) => {
                if (c.label !== label) return c;
                return { ...c, selected: !c.selected };
            })
        );
    };

    const resetFilters = () => {
        setCategories(categories.map((c) => ({ ...c, selected: false })));
        setFlavours(flavours.map((c) => ({ ...c, selected: false })));
    };

    useEffect(() => {
        const filterWhiskeys = () => {
            let whisks = Whiskeys;
            // OR filter categories
            if (selectedCategories.length !== 0) {
                whisks = Whiskeys.filter((w) =>
                    selectedCategories.some((c) => c === w.details.Category)
                );
            }
            // AND filter flavours
            if (selectedFlavours.length !== 0) {
                whisks = whisks.filter((w) => {
                    let bool = true;
                    selectedFlavours.forEach((f) => {
                        if (!w.taste.includes(f)) {
                            bool = false;
                        }
                    });
                    return bool;
                });
            }
            return whisks;
        };
        const selectedCategories = categories.filter((c) => c.selected).map((c) => c.label);
        const selectedFlavours = flavours.filter((f) => f.selected).map((f) => f.label);
        setCurrentWhiskeys(filterWhiskeys());
    }, [categories, flavours]);

    return (
        <WhiskeyPage>
            <WhiskeyList>
                <FilterDiv onClick={() => setActive(null)}>FILTER</FilterDiv>
                <WhiskeyListUl>
                    {currentWhiskeys.map((w, i) => (
                        <WhiskeyListElement
                            key={w.name}
                            light={i % 2 === 0}
                            onClick={() => setActiveWhiskey(w.name)}
                        >
                            {w.name}
                        </WhiskeyListElement>
                    ))}
                </WhiskeyListUl>
            </WhiskeyList>
            {active ? (
                <ActiveWhiskey>
                    <h2>{active.name}</h2>
                    {active.img && (
                        <img src={require("./whiskey/" + active.img)} alt={"whiskey taste"} />
                    )}
                    <div>
                        <WhiskeyDetails>
                            {Object.keys(active.details).map((k) => (
                                <WhiskeyDetail key={k}>
                                    <span style={{ marginRight: "20px" }}>{k}</span>
                                    <span style={{ textAlign: "right" }}>{active.details[k]}</span>
                                </WhiskeyDetail>
                            ))}
                        </WhiskeyDetails>
                    </div>
                </ActiveWhiskey>
            ) : (
                <FilterPage>
                    <ResetTitle
                        onClick={() => {
                            resetFilters();
                        }}
                    >
                        Reset filters
                    </ResetTitle>
                    <CategoryFilter>
                        <CategoryTitle>Category</CategoryTitle>
                        <div>
                            {categories.map((category) => (
                                <div key={category.label} style={{ margin: "20px" }}>
                                    <input
                                        type="checkbox"
                                        id={category.label}
                                        checked={category.selected}
                                        onChange={() => toggleCategory(category.label)}
                                    />
                                    <label style={{ marginLeft: "15px" }} htmlFor={category.label}>
                                        {category.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CategoryFilter>
                    <TasteFilter>
                        <TasteTitle>Taste</TasteTitle>
                        <div>
                            {flavours.map((category) => (
                                <div key={category.label} style={{ margin: "20px" }}>
                                    <input
                                        type="checkbox"
                                        id={category.label}
                                        checked={category.selected}
                                        onChange={() => toggleFlavour(category.label)}
                                    />
                                    <label style={{ marginLeft: "15px" }} htmlFor={category.label}>
                                        {category.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </TasteFilter>
                </FilterPage>
            )}
        </WhiskeyPage>
    );
};

export default Whiskey;
