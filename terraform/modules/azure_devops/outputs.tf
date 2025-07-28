output "project_id" {
  value = azuredevops_project.doe.id
}

output "repo_id" {
  value = azuredevops_git_repository.doe_repo.id
}
