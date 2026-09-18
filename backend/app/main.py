import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router as prediction_router
from app.core.config import settings
from app.services.inference import load_model
from app.utils.logging_config import configure_logging

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load the model ONCE, not on every request.
    logger.info("Starting up %s ...", settings.APP_NAME)
    load_model()
    yield
    # Shutdown: nothing to clean up for this simple app.
    logger.info("Shutting down %s ...", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    description="Predicts Indian residential property prices from listing details.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)


@app.get("/", tags=["health"])
def root():
    return {
        "message": settings.APP_NAME,
        "docs": "/docs",
        "health": "/health",
    }
