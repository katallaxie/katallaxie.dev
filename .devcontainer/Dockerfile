# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.238.1/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version (use ubuntu-24.04 or ubuntu-18.04 on local arm64/Apple Silicon): ubuntu-24.04, ubuntu-20.04, ubuntu-18.04
ARG VARIANT="jammy"
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
FROM mcr.microsoft.com/vscode/devcontainers/base:1-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install protobuf-compiler

RUN groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /home/$USERNAME
