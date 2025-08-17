from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import coneq_routes, sgpm_routes

app = FastAPI(title="PMMT API", description="API para o sistema da PMMT")

# Configuração do CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
"http://172.16.10.54",
"http://172.16.10.54:8000",
"http://172.16.10.54:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo as rotas
app.include_router(coneq_routes.router)
app.include_router(sgpm_routes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 