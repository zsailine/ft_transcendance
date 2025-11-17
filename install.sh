(cd FRONTEND && npm install) &

# Lancer les services backend
(cd BACKEND/Authentication && npm install) &
(cd BACKEND/Gateway && npm install) &
(cd BACKEND/OnlinePong && npm install) &
(cd BACKEND/User && npm install) &
(cd BACKEND/Chat && npm install) &
(cd BACKEND/Friend && npm i) &

wait
