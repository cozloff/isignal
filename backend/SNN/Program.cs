using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SNN.Data;
using SNN.Data.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SNN.Extensions;
using SNN.Models;
using SNN.Services;
using SNN.Exceptions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));


//builder.Services.AddSingleton(options => new BlobServiceClient(builder.Configuration.GetConnectionString("StorageAccount")));
builder.Services.AddSingleton<ITokenProvider, TokenProvider>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<Seed>();
builder.Services.AddSwaggerGenWithAuth();
builder.Services.AddIdentity<ApplicationIdentity, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 4;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policyBuilder =>
    {
        policyBuilder.WithOrigins(builder.Configuration["CORS:Origins"] ?? "");
        policyBuilder.AllowAnyHeader();
        policyBuilder.WithMethods("OPTIONS", "GET", "POST", "PUT", "DELETE");
    });
});
builder.Services.AddExceptionHandler<AuthExceptionHandler>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? "")),
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "",
        RequireExpirationTime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(option =>
{
    option.AddPolicy("AdminCanManageScope", policy => policy.RequireClaim("AdminCanManageScope"));
    option.AddPolicy("UserCanEditBadActor", policy => policy.RequireClaim("UserCanEditBadActor"));
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddProblemDetails();


var app = builder.Build();


// Seed roles, and create indexes when the application starts
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await DBInit.DBInitAsync(services);
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
else
{
    // Development
    app.UseSwagger();
    app.UseSwaggerUI();

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var seeder = services.GetRequiredService<Seed>();
        await seeder.SeedUsersAsync();

        // TODO: SEED TABLES AFTER USERS
        // var pgContext = services.GetRequiredService<ApplicationDbContext>();
        // await Seed.SeedTables(pgContext, false, CancellationToken.None);
    }
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.MapControllers();

app.Run();
