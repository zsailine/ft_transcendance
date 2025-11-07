#!/bin/bash

# Lancer le frontend
(cd FRONTEND && npm run dev) &

# Lancer les services backend
(cd BACKEND/Authentication && npm run dev) &
(cd BACKEND/Gateway && npm run dev) &
(cd BACKEND/OnlinePong && npm run dev) &
(cd BACKEND/User && npm run dev) &

# Attendre que tout s'arrête (CTRL+C)
wait