// using Bogus;
// using Microsoft.EntityFrameworkCore;
// using MongoDB.Bson;
// using System.Globalization;
// using System.Text;
// using SNN.Models;

// namespace SNN.Data.Seed
// {
//     public class Seed
//     {
//         public static async Task SeedTables(AppDbContext context, bool _, CancellationToken ct)
//         {
//             var exists = await context.Set<RegisteredOffenders>().AnyAsync(ct);
//             if (exists) return;

//             var fakeOffenders = GenerateFakeRegisteredOffenders();

//             // Save to DB
//             foreach (var offender in fakeOffenders)
//             {
//                 await context.Set<RegisteredOffenders>().AddAsync(offender, ct);
//                 await context.SaveChangesAsync(ct); 
//             }

//             // Export to CSV
//             ExportRegisteredOffendersToCsv(fakeOffenders);
//         }

//         private static List<RegisteredOffenders> GenerateFakeRegisteredOffenders()
//         {
//             return new Faker<RegisteredOffenders>()
//                 .RuleFor(x => x.Id, _ => ObjectId.GenerateNewId().ToString())
//                 .RuleFor(x => x.FirstName, f => f.Name.FirstName())
//                 .RuleFor(x => x.MiddleName, f => f.Name.FirstName())
//                 .RuleFor(x => x.LastName, f => f.Name.LastName())
//                 .RuleFor(x => x.PriorNames, f => f.Name.FullName())
//                 .RuleFor(x => x.Dob, f => f.Date.Past(30, DateTime.UtcNow.AddYears(-18)).Date) 
//                 .RuleFor(x => x.Photo, f =>
//                 {
//                     var gender = f.PickRandom("men", "women");
//                     var index = f.Random.Number(0, 99);
//                     return $"https://randomuser.me/api/portraits/{gender}/{index}.jpg";
//                 })
//                 .RuleFor(x => x.StreetAddress, f => f.Address.StreetAddress())
//                 .RuleFor(x => x.City, f => f.Address.City())
//                 .RuleFor(x => x.State, f => f.Address.StateAbbr())
//                 .RuleFor(x => x.Zip, f => f.Address.ZipCode())
//                 .RuleFor(x => x.Institution, f => f.Company.CompanyName())
//                 .RuleFor(x => x.FindingDate, f => f.Date.Recent(100).Date) 
//                 .RuleFor(x => x.Details, f => f.Lorem.Paragraph())
//                 .Generate(new Random().Next(100, 150));
//         }


//         private static void ExportRegisteredOffendersToCsv(List<RegisteredOffenders> offenders)
//         {
//             var csvLines = new List<string> { "FirstName,LastName,Dob" };

//             foreach (var offender in offenders)
//             {
//                 var line = $"{offender.FirstName},{offender.LastName},{offender.Dob.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}";
//                 csvLines.Add(line);
//             }

//             var exportDir = Path.Combine(Directory.GetCurrentDirectory(), "export");
//             Directory.CreateDirectory(exportDir);
//             var filePath = Path.Combine(exportDir, "registered_offenders_export.csv");

//             File.WriteAllLines(filePath, csvLines, Encoding.UTF8);
//         }
//     }
// }
