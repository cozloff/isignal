provider "azurerm" {
  features {}
}

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "vault_rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_key_vault" "vault" {
  name                        = var.key_vault_name
  location                    = azurerm_resource_group.vault_rg.location
  resource_group_name         = azurerm_resource_group.vault_rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"  # "premium" = $1/month/key (HSM)
  soft_delete_retention_days  = 7 # Recover deleted keys/secrets for 7 days
  purge_protection_enabled    = true # Prevents accidental deletion

  access_policy { # Since it's just us two
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = ["Set", "Get", "List", "Delete", "Purge"]
  }
}