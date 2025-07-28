terraform {
  required_providers {
    azuredevops = {
      source  = "microsoft/azuredevops"
      version = "~> 1.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

module "keyvault" {
  source              = "./modules/azure_key_vault"
  resource_group_name = "rg-terraform"
  location            = "westus2"
  key_vault_name      = "akv-doe"
}

// Azure DevOps - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
data "azurerm_key_vault_secret" "read_pat" {
  name         = "azure-devops-pat"
  key_vault_id = module.keyvault.key_vault_id
}

provider "azuredevops" {
  org_service_url       = "https://dev.azure.com/cozloffd"
  personal_access_token = data.azurerm_key_vault_secret.read_pat.value
}

module "devops" {
  source              = "./modules/azure_devops"
  project_name        = "terraform-doe"
  project_description = "Mission Terraform the DOE"
  repo_name           = "doe-repo"
  pipeline_name       = "CI Build"
  pipeline_path       = "azure-pipelines.yml"
}

