from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables / a .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "House Price Prediction API"
    MODEL_PATH: str = "models/house_price.pkl"
    LOCATIONS_PATH: str = "models/locations.json"
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
