import yaml


def load_config(config_path: str = "config/config.yml") -> dict:
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
    return config
