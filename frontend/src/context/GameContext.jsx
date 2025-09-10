import React, {createContext, useContext} from 'react';

export const GameContext = createContext();

export const useGame = () => useContext(GameContext); //no need to rewrite multiple times