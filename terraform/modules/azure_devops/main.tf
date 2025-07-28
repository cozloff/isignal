terraform {
  required_providers {
    azuredevops = {
      source = "microsoft/azuredevops"
    }
  }
}

resource "azuredevops_project" "doe" {
  name               = var.project_name
  description        = var.project_description
  visibility         = "private"
  version_control    = "Git"
  work_item_template = "Agile"
}

resource "azuredevops_git_repository" "doe_repo" {
  project_id = azuredevops_project.doe.id
  name       = var.repo_name
  initialization { 
    init_type = "Clean" // Empty repo, no files
  }
}

resource "azuredevops_build_definition" "doe_pipeline" {
  project_id = azuredevops_project.doe.id
  name       = var.pipeline_name
  path       = "\\"
  repository {
    repo_type   = "TfsGit"
    repo_id     = azuredevops_git_repository.doe_repo.id
    branch_name = "main"
    yml_path    = var.pipeline_path
  }
}
