FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS base

FROM base AS deps
WORKDIR /source
COPY SNN/SNN.csproj .
RUN dotnet restore
COPY ./SNN .
RUN rm -rf bin/ obj/

FROM deps AS development
CMD ["dotnet", "watch", "run", "--no-launch-profile"]

FROM deps AS build
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS release
RUN apk add --no-cache icu-libs

WORKDIR /app
COPY --from=build /app ./

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

USER appuser

ENTRYPOINT ["dotnet", "SNN.dll"]
